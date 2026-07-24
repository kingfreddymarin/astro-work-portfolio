// Authentication and database client-side integrations.
// Lazy-loads Firebase Auth & Firestore SDKs from the Google gstatic CDN to preserve quick initial page loading.

import { firebaseConfig, firebaseConfigured } from './firebase-config.js';

const FB_VERSION = '12.12.1';
let _auth = null;
let _db = null;

// Initialize and retrieve the Firebase Auth instance.
export async function getAuthInstance() {
  if (_auth) return _auth;
  if (!firebaseConfigured) throw new Error("Firebase is not configured yet.");
  const { initializeApp, getApps } = await import(
    /* @vite-ignore */ `https://www.gstatic.com/firebasejs/${FB_VERSION}/firebase-app.js`
  );
  const { getAuth } = await import(
    /* @vite-ignore */ `https://www.gstatic.com/firebasejs/${FB_VERSION}/firebase-auth.js`
  );
  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  _auth = getAuth(app);
  return _auth;
}

// Initialize and retrieve the Firebase Firestore instance.
export async function getDbInstance() {
  if (_db) return _db;
  if (!firebaseConfigured) throw new Error("Firebase is not configured yet.");
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

// Start the listener for session updates and dispatch them to components.
let authListenerInitialized = false;
export async function initAuthListener() {
  if (authListenerInitialized) return;
  if (!firebaseConfigured) return;
  authListenerInitialized = true;
  
  try {
    const auth = await getAuthInstance();
    const { onAuthStateChanged } = await import(
      /* @vite-ignore */ `https://www.gstatic.com/firebasejs/${FB_VERSION}/firebase-auth.js`
    );
    
    onAuthStateChanged(auth, (user) => {
      document.dispatchEvent(new CustomEvent('auth-changed', { detail: { user } }));
    });
  } catch (err) {
    console.error('[auth] Failed to initialize auth listener:', err);
  }
}

// Sign in a user using the Google Sign-in popup.
export async function loginWithGoogle() {
  const auth = await getAuthInstance();
  const { GoogleAuthProvider, signInWithPopup } = await import(
    /* @vite-ignore */ `https://www.gstatic.com/firebasejs/${FB_VERSION}/firebase-auth.js`
  );
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

// Sign out the current user session.
export async function logoutUser() {
  const auth = await getAuthInstance();
  const { signOut } = await import(
    /* @vite-ignore */ `https://www.gstatic.com/firebasejs/${FB_VERSION}/firebase-auth.js`
  );

  // Sign out locally first
  await signOut(auth);

  // Propagate logout to connected applications via top-level redirect chain.
  // This bypasses browser third-party storage partitioning which blocks iframe IndexedDB access.
  const appLogoutUrl = 'https://studio-archive.web.app/#logout&redirect=' + encodeURIComponent(window.location.origin);
  window.location.href = appLogoutUrl;
}

// Save a custom build configuration.
export async function saveUserBuild(userId, buildData) {
  const db = await getDbInstance();
  const { collection, addDoc, doc, setDoc, serverTimestamp } = await import(
    /* @vite-ignore */ `https://www.gstatic.com/firebasejs/${FB_VERSION}/firebase-firestore.js`
  );
  
  const buildDoc = {
    userId,
    goalId: buildData.goalId,
    featureIds: Array.from(buildData.featureIds || []),
    scaleId: buildData.scaleId,
    timelineId: buildData.timelineId,
    qualityId: buildData.qualityId,
    name: buildData.name || `Build Config — ${new Date().toLocaleDateString()}`,
    updatedAt: serverTimestamp(),
  };

  if (buildData.id) {
    // Update existing configuration
    await setDoc(doc(db, 'builds', buildData.id), buildDoc, { merge: true });
    return buildData.id;
  } else {
    // Save new configuration
    const docRef = await addDoc(collection(db, 'builds'), {
      ...buildDoc,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }
}

// Retrieve all saved build configurations for a user.
export async function getUserBuilds(userId) {
  const db = await getDbInstance();
  const { collection, query, where, getDocs } = await import(
    /* @vite-ignore */ `https://www.gstatic.com/firebasejs/${FB_VERSION}/firebase-firestore.js`
  );
  
  const q = query(collection(db, 'builds'), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  const builds = [];
  snapshot.forEach((doc) => {
    builds.push({ id: doc.id, ...doc.data() });
  });
  
  // Sort in-memory descending by updatedAt/createdAt (saves composite indexes config)
  builds.sort((a, b) => {
    const tA = a.updatedAt?.seconds || a.createdAt?.seconds || 0;
    const tB = b.updatedAt?.seconds || b.createdAt?.seconds || 0;
    return tB - tA;
  });
  return builds;
}

// Delete a saved configuration.
export async function deleteUserBuild(buildId) {
  const db = await getDbInstance();
  const { doc, deleteDoc } = await import(
    /* @vite-ignore */ `https://www.gstatic.com/firebasejs/${FB_VERSION}/firebase-firestore.js`
  );
  await deleteDoc(doc(db, 'builds', buildId));
}

// Publish a build configuration to the public `shared_builds` collection.
export async function shareBuild(buildData) {
  const db = await getDbInstance();
  const { collection, addDoc, serverTimestamp } = await import(
    /* @vite-ignore */ `https://www.gstatic.com/firebasejs/${FB_VERSION}/firebase-firestore.js`
  );
  
  const docRef = await addDoc(collection(db, 'shared_builds'), {
    goalId: buildData.goalId,
    featureIds: Array.from(buildData.featureIds || []),
    scaleId: buildData.scaleId,
    timelineId: buildData.timelineId,
    qualityId: buildData.qualityId,
    name: buildData.name || 'Shared Build',
    userId: buildData.userId || null,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// Retrieve a publicly shared configuration document.
export async function getSharedBuild(sharedId) {
  const db = await getDbInstance();
  const { doc, getDoc } = await import(
    /* @vite-ignore */ `https://www.gstatic.com/firebasejs/${FB_VERSION}/firebase-firestore.js`
  );
  
  const docSnap = await getDoc(doc(db, 'shared_builds', sharedId));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}
