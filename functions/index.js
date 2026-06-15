// ─────────────────────────────────────────────────────────────────────────────
// FJML Studio — lead email dispatch.
//
// Fires when a lead is written to Firestore (`leads/{id}`), then enqueues two
// emails into the `mail` collection that the "Trigger Email from Firestore"
// extension watches and sends via your SMTP provider:
//
//   1. Studio notification  → STUDIO_INBOX  (reply-to = the visitor)
//   2. Thank-you letter     → the visitor   (reply-to = the studio)
//
// email-templates.js is the SAME file used by the site (single source of
// truth). It's copied into this folder at deploy time by the `predeploy` hook
// in firebase.json, so the brand stays in lockstep.
// ─────────────────────────────────────────────────────────────────────────────

import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { setGlobalOptions } from 'firebase-functions/v2';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { leadNotificationEmail, leadConfirmationEmail } from './email-templates.js';

initializeApp();
const db = getFirestore();

setGlobalOptions({ region: 'us-central1', maxInstances: 5 });

const STUDIO_INBOX = 'freddymarin.jpg@gmail.com';

export const onLead = onDocumentCreated('leads/{id}', async (event) => {
  const lead = event.data?.data();
  if (!lead) return;

  const notify = leadNotificationEmail(lead);
  const mailbox = db.collection('mail');
  const jobs = [];

  // 1. Notify the studio.
  jobs.push(
    mailbox.add({
      to: STUDIO_INBOX,
      ...(lead.email ? { replyTo: lead.email } : {}),
      message: { subject: notify.subject, html: notify.html, text: notify.text },
    })
  );

  // 2. Thank-you letter to the visitor (only if a valid-looking email exists).
  if (lead.email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(lead.email)) {
    const confirm = leadConfirmationEmail(lead);
    jobs.push(
      mailbox.add({
        to: lead.email,
        replyTo: STUDIO_INBOX,
        message: { subject: confirm.subject, html: confirm.html, text: confirm.text },
      })
    );
  }

  await Promise.all(jobs);
});
