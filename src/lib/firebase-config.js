// ─────────────────────────────────────────────────────────────────────────────
// Firebase web config (PUBLIC — safe to commit; access is governed by Firestore
// security rules, not by hiding these values).
//
// HOW TO FILL THIS IN:
//   1. Firebase console → Project "fjml-studio" → Project settings (gear).
//   2. Under "Your apps", add a Web app (</>) if none exists. Skip Hosting setup.
//   3. Copy the `firebaseConfig` it shows you and paste apiKey / messagingSenderId
//      / appId below (the other fields are already correct for fjml-studio).
//   4. Console → Build → Firestore Database → Create database (production mode).
//
// Until real values are pasted, the inquiry form auto-falls back to a mailto:
// compose so nothing breaks.
// ─────────────────────────────────────────────────────────────────────────────

export const firebaseConfig = {
  apiKey: "AIzaSyCskGwWj7Enf494USjuh6NtT8n7yilcT90",
  authDomain: "fjml-studio.firebaseapp.com",
  projectId: "fjml-studio",
  storageBucket: "fjml-studio.firebasestorage.app",
  messagingSenderId: "135626193495",
  appId: "1:135626193495:web:927f76edf5ee9dade40112",
};

// Firestore collection leads are written to.
export const LEADS_COLLECTION = "leads";

// Studio owner — signing in with this Google account unlocks the admin inbox
// (reads every incoming lead). Must match the email in firestore.rules.
export const STUDIO_ADMIN_EMAIL = "freddymarin.jpg@gmail.com";

// True once the placeholder values have been replaced with real ones.
export const firebaseConfigured =
  !Object.values(firebaseConfig).some((v) => String(v).startsWith("PASTE_"));
