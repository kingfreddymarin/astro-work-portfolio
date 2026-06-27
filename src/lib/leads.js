// Lead submission — writes the inquiry form to Firestore.
// Firebase is loaded lazily from the gstatic CDN only when a lead is actually
// submitted, so it never weighs down initial page load.

import { firebaseConfig, firebaseConfigured, LEADS_COLLECTION } from './firebase-config.js';
import { leadNotificationEmail } from './email-templates.js';

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
  // Instant push + emails are sent server-side by the onLead Cloud Function
  // (triggered by the Firestore write below), so the ntfy topic and SMTP
  // credentials never reach the browser.

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
      userId: lead.userId || null,
    });

    return { ok: true };
  } catch (err) {
    console.error('[leads] Firestore write failed, falling back to mailto:', err);
    openMailtoFallback(lead);
    return { ok: false, fallback: 'mailto' };
  }
}

/**
 * Retrieve all inquiries submitted by a specific user.
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function getInquiriesByUser(userId) {
  try {
    const db = await getDb();
    const { collection, query, where, getDocs } = await import(
      /* @vite-ignore */ `https://www.gstatic.com/firebasejs/${FB_VERSION}/firebase-firestore.js`
    );
    const q = query(collection(db, LEADS_COLLECTION), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const inquiries = [];
    snapshot.forEach((doc) => {
      inquiries.push({ id: doc.id, ...doc.data() });
    });
    // Sort in-memory to avoid index requirement
    inquiries.sort((a, b) => {
      const tA = a.createdAt?.seconds || 0;
      const tB = b.createdAt?.seconds || 0;
      return tB - tA;
    });
    return inquiries;
  } catch (err) {
    console.error('[leads] Failed to retrieve user inquiries:', err);
    return [];
  }
}

function openMailtoFallback(lead) {
  // mailto carries plain text only, so use the branded template's text body —
  // the visitor's mail app opens prefilled and ready to send.
  const { subject, text } = leadNotificationEmail(lead);
  window.location.href =
    `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
}
