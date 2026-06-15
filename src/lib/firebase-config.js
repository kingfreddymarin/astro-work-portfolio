// ─────────────────────────────────────────────────────────────────────────────
// Firebase web config (PUBLIC — safe to commit; access is governed by Firestore
// security rules, not by hiding these values).
//
// HOW TO FILL THIS IN:
//   1. Firebase console → Project "freddy-marinn" → Project settings (gear).
//   2. Under "Your apps", add a Web app (</>) if none exists. Skip Hosting setup.
//   3. Copy the `firebaseConfig` object it shows you and paste the values below.
//
// Until real values are pasted, the inquiry form auto-falls back to a mailto:
// compose so nothing breaks.
// ─────────────────────────────────────────────────────────────────────────────

export const firebaseConfig = {
  apiKey: "PASTE_API_KEY",
  authDomain: "freddy-marinn.firebaseapp.com",
  projectId: "freddy-marinn",
  storageBucket: "freddy-marinn.appspot.com",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID",
};

// Firestore collection leads are written to.
export const LEADS_COLLECTION = "leads";

// True once the placeholder values have been replaced with real ones.
export const firebaseConfigured =
  !Object.values(firebaseConfig).some((v) => String(v).startsWith("PASTE_"));
