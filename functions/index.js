// ─────────────────────────────────────────────────────────────────────────────
// FJML Studio — lead email dispatch.
//
// Fires when a lead is written to Firestore (`leads/{id}`) and sends two emails
// directly via Gmail SMTP (nodemailer) — no extension, no `mail` collection:
//
//   1. Studio notification  → STUDIO_INBOX  (reply-to = the visitor)
//   2. Thank-you letter     → the visitor   (reply-to = the studio)
//
// The Gmail app password is stored as a Cloud Functions secret:
//   firebase functions:secrets:set GMAIL_APP_PASSWORD
//
// email-templates.js is the SAME file the site uses (single source of truth);
// it's copied into this folder at deploy time by the firebase.json predeploy.
// ─────────────────────────────────────────────────────────────────────────────

import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { setGlobalOptions } from 'firebase-functions/v2';
import { defineSecret } from 'firebase-functions/params';
import { logger } from 'firebase-functions';
import { initializeApp } from 'firebase-admin/app';
import nodemailer from 'nodemailer';
import { leadNotificationEmail, leadConfirmationEmail } from './email-templates.js';

initializeApp();
setGlobalOptions({ region: 'us-central1', maxInstances: 5 });

const GMAIL_APP_PASSWORD = defineSecret('GMAIL_APP_PASSWORD');
// ntfy topic kept server-side as a secret so it's never in the public repo
// or browser bundle (the topic name is the only access control on ntfy.sh).
const NTFY_TOPIC = defineSecret('NTFY_TOPIC');

const STUDIO_INBOX = 'freddymarin.jpg@gmail.com';
const FROM = `FJML Studio <${STUDIO_INBOX}>`;
const isEmail = (s) => typeof s === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s);

// Instant push to the studio phone via ntfy (never throws).
async function pingNtfy(lead) {
  const topic = NTFY_TOPIC.value();
  if (!topic) return;
  const body = [
    `${lead.name || 'Someone'}${lead.company ? ` · ${lead.company}` : ''}`,
    lead.service ? `Service: ${lead.service}${lead.package ? ` / ${lead.package}` : ''}` : null,
    lead.specialRequest ? `[Special Request] Evidence: ${String(lead.specialEvidence).slice(0, 120)}` : null,
    isEmail(lead.email) ? `Reply: ${lead.email}` : null,
    lead.message ? `“${String(lead.message).slice(0, 160)}”` : null,
  ].filter(Boolean).join('\n');
  try {
    await fetch(`https://ntfy.sh/${topic}`, {
      method: 'POST',
      body,
      headers: {
        Title: lead.specialRequest ? '⚠️ New Special Request Transmitted' : 'New directive transmitted',
        Priority: lead.specialRequest ? 'urgent' : 'high',
        Tags: lead.specialRequest ? 'satellite,incoming_envelope,warning' : 'satellite,incoming_envelope',
        ...(isEmail(lead.email) ? { Click: `mailto:${lead.email}` } : {}),
      },
    });
  } catch (err) {
    logger.warn('ntfy ping failed', err);
  }
}

export const onLead = onDocumentCreated(
  { document: 'leads/{id}', secrets: [GMAIL_APP_PASSWORD, NTFY_TOPIC] },
  async (event) => {
    const lead = event.data?.data();
    if (!lead) return;

    // Instant push first — cheapest, fastest signal.
    await pingNtfy(lead);

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: STUDIO_INBOX, pass: GMAIL_APP_PASSWORD.value() },
    });

    const notify = leadNotificationEmail(lead);
    const jobs = [
      transporter.sendMail({
        from: FROM,
        to: STUDIO_INBOX,
        replyTo: isEmail(lead.email) ? lead.email : undefined,
        subject: notify.subject,
        text: notify.text,
        html: notify.html,
      }),
    ];

    // Thank-you letter to the visitor (only if a valid email was provided).
    if (isEmail(lead.email)) {
      const confirm = leadConfirmationEmail(lead);
      jobs.push(
        transporter.sendMail({
          from: FROM,
          to: lead.email,
          replyTo: STUDIO_INBOX,
          subject: confirm.subject,
          text: confirm.text,
          html: confirm.html,
        })
      );
    }

    const results = await Promise.allSettled(jobs);
    results.forEach((r, i) => {
      const which = i === 0 ? 'studio-notification' : 'visitor-confirmation';
      if (r.status === 'fulfilled') logger.info(`Sent ${which}`, { messageId: r.value?.messageId });
      else logger.error(`Failed ${which}`, r.reason);
    });
  }
);
