// Single Sign-On (SSO) helpers for sharing Firebase Auth state across FJML Studio apps.
// Reads/writes the auth state stored in IndexedDB.

const FIREBASE_DB_NAME = 'firebaseLocalStorageDb';
const FIREBASE_STORE_NAME = 'firebaseLocalStorage';
const AUTH_KEY = 'firebase:authUser:AIzaSyCskGwWj7Enf494USjuh6NtT8n7yilcT90:[DEFAULT]';

/**
 * Reads the Firebase Auth user state from IndexedDB.
 * @returns {Promise<any | null>}
 */
export function readFirebaseSession() {
  return new Promise((resolve) => {
    const request = indexedDB.open(FIREBASE_DB_NAME);
    request.onerror = () => resolve(null);
    request.onsuccess = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(FIREBASE_STORE_NAME)) {
        db.close();
        resolve(null);
        return;
      }
      try {
        const transaction = db.transaction([FIREBASE_STORE_NAME], 'readonly');
        const store = transaction.objectStore(FIREBASE_STORE_NAME);
        const getReq = store.get(AUTH_KEY);
        getReq.onsuccess = () => {
          db.close();
          resolve(getReq.result || null);
        };
        getReq.onerror = () => {
          db.close();
          resolve(null);
        };
      } catch (err) {
        db.close();
        resolve(null);
      }
    };
  });
}

/**
 * Writes the Firebase Auth user state to IndexedDB.
 * @param {any} sessionData
 * @returns {Promise<void>}
 */
export function writeFirebaseSession(sessionData) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(FIREBASE_DB_NAME);
    request.onerror = () => reject(new Error('IndexedDB open failed'));
    request.onsuccess = (e) => {
      const db = e.target.result;
      
      // Helper to perform the write transaction
      const doWrite = (activeDb) => {
        const transaction = activeDb.transaction([FIREBASE_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(FIREBASE_STORE_NAME);
        
        let putReq;
        if (store.keyPath) {
          // In-line key store (Firebase uses keyPath: "fbase_key")
          const valueToWrite = typeof sessionData === 'object' && sessionData !== null ? { ...sessionData } : { value: sessionData };
          valueToWrite[store.keyPath] = AUTH_KEY;
          putReq = store.put(valueToWrite);
        } else {
          // Out-of-line key store
          putReq = store.put(sessionData, AUTH_KEY);
        }

        putReq.onsuccess = () => {
          activeDb.close();
          resolve();
        };
        putReq.onerror = () => {
          activeDb.close();
          reject(new Error('Failed to write session key'));
        };
      };

      if (!db.objectStoreNames.contains(FIREBASE_STORE_NAME)) {
        const currentVersion = db.version;
        db.close();
        
        // Upgrade database version to create the missing store matching Firebase specs
        const upgradeReq = indexedDB.open(FIREBASE_DB_NAME, currentVersion + 1);
        upgradeReq.onupgradeneeded = (evt) => {
          const upgradeDb = evt.target.result;
          if (!upgradeDb.objectStoreNames.contains(FIREBASE_STORE_NAME)) {
            upgradeDb.createObjectStore(FIREBASE_STORE_NAME, { keyPath: 'fbase_key' });
          }
        };
        upgradeReq.onsuccess = (evt) => {
          doWrite(evt.target.result);
        };
        upgradeReq.onerror = () => {
          reject(new Error('Failed to upgrade database version'));
        };
      } else {
        doWrite(db);
      }
    };
  });
}
