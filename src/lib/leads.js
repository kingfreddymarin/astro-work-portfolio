// Lead submission — writes the inquiry form to Firestore.
// Firebase is loaded lazily from the gstatic CDN only when a lead is actually
// submitted, so it never weighs down initial page load.

import { firebaseConfig, firebaseConfigured, LEADS_COLLECTION } from './firebase-config.js';
import { leadNotificationEmail } from './email-templates.js';
import { NTFY_SERVER, NTFY_TOPIC, ntfyEnabled } from './notify-config.js';

const FB_VERSION = '12.12.1';
const CONTACT_EMAIL = 'freddymarin.jpg@gmail.com';

let _db = null;

async function getDb() {
  if (_db) return _db;
  const { initializeApp, getApps } = await import(
    /* @vite-ignore */ `https://www.gstatic.com/firebasejs/${FB_VERSION}/firebase-app.js`
  );
  const { getFirestore } = await import(
    /* @vite-ignore */ `https://www.gstatic.com/firebasejs/${FB_VERSION}/firebase-firestore.js`
  );
  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  _db = getFirestore(app);
  return _db;
}

/**
 * @param {{name:string,email:string,company:string,service:string,package:string,message:string,source:string}} lead
 * @returns {Promise<{ok:true, fallback?:false} | {ok:false, fallback:'mailto'}>}
 */
export async function submitLead(lead) {
  // Fire an instant push the moment a directive lands (never blocks the submit).
  pingNtfy(lead);

  // No real config yet → hand off to the visitor's mail client.
  if (!firebaseConfigured) {
    openMailtoFallback(lead);
    return { ok: false, fallback: 'mailto' };
  }

  try {
    const db = await getDb();
    const { collection, addDoc, serverTimestamp } = await import(
      /* @vite-ignore */ `https://www.gstatic.com/firebasejs/${FB_VERSION}/firebase-firestore.js`
    );

    await addDoc(collection(db, LEADS_COLLECTION), {
      name: lead.name.trim(),
      email: lead.email.trim(),
      company: (lead.company || '').trim(),
      service: lead.service || '',
      package: lead.package || '',
      message: lead.message.trim(),
      source: lead.source || 'contact',
      userAgent: navigator.userAgent.slice(0, 300),
      pageUrl: location.href.slice(0, 300),
      createdAt: serverTimestamp(),
    });

    return { ok: true };
  } catch (err) {
    console.error('[leads] Firestore write failed, falling back to mailto:', err);
    openMailtoFallback(lead);
    return { ok: false, fallback: 'mailto' };
  }
}

// Instant push via ntfy — fire-and-forget; failures are swallowed so a
// notification hiccup never affects the visitor's submission.
function pingNtfy(lead) {
  if (!ntfyEnabled || typeof fetch !== 'function') return;

  const lines = [
    `${lead.name || 'Someone'}${lead.company ? ` · ${lead.company}` : ''}`,
    lead.service ? `Service: ${lead.service}${lead.package ? ` / ${lead.package}` : ''}` : null,
    lead.email ? `Reply: ${lead.email}` : null,
    lead.message ? `“${lead.message.slice(0, 160)}”` : null,
  ].filter(Boolean);

  try {
    fetch(`${NTFY_SERVER}/${NTFY_TOPIC}`, {
      method: 'POST',
      body: lines.join('\n'),
      headers: {
        Title: 'New directive transmitted',
        Priority: 'high',
        Tags: 'satellite,incoming_envelope',
        ...(lead.email ? { Click: `mailto:${lead.email}` } : {}),
      },
      keepalive: true, // survives the page navigating to mailto:
    }).catch(() => {});
  } catch (_) { /* never throw from a notification */ }
}

function openMailtoFallback(lead) {
  // mailto carries plain text only, so use the branded template's text body —
  // the visitor's mail app opens prefilled and ready to send.
  const { subject, text } = leadNotificationEmail(lead);
  window.location.href =
    `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
}
