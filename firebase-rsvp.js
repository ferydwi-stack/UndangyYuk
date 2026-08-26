/**
 * UNDANGYUK - FIREBASE CLOUD FIRESTORE RSVP & WISHES SYNC
 * Centralized Real-time RSVP & Guestbook Handler with LocalStorage Fallback
 */

// 1. MASUKKAN KONFIGURASI FIREBASE ANDA DI SINI
// Dapatkan config ini dari Firebase Console -> Project Settings -> General -> Your Apps -> Web App
window.FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 2. INITIALIZE FIREBASE SDK (Firestore)
let firestoreDb = null;
let isFirebaseReady = false;

(function initFirebaseRSVP() {
  // Check if user has entered their real Firebase credentials
  if (
    window.FIREBASE_CONFIG &&
    window.FIREBASE_CONFIG.apiKey &&
    !window.FIREBASE_CONFIG.apiKey.includes("YOUR_API_KEY")
  ) {
    // Dynamically load Firebase SDK modules
    const scriptApp = document.createElement("script");
    scriptApp.type = "module";
    scriptApp.innerHTML = `
      import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
      import { 
        getFirestore, 
        collection, 
        addDoc, 
        onSnapshot, 
        query, 
        orderBy, 
        limit, 
        serverTimestamp 
      } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

      try {
        const app = initializeApp(window.FIREBASE_CONFIG);
        const db = getFirestore(app);
        window.firestoreDb = db;
        window.firestoreTools = { collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp };
        window.isFirebaseReady = true;
        console.log("🔥 Firebase Firestore connected successfully for RSVP!");
        
        // Trigger live listener if template has initialized
        if (window.onFirebaseReadyCallback) {
          window.onFirebaseReadyCallback();
        }
      } catch (err) {
        console.warn("Firebase initialization warning:", err);
      }
    `;
    document.head.appendChild(scriptApp);
  } else {
    console.log("ℹ️ Firebase config belum diisi. Sistem menggunakan LocalStorage Fallback secara otomatis.");
  }
})();

/**
 * Kirim RSVP ke Firebase Firestore (atau LocalStorage jika belum connect)
 * @param {string} themeId - ID tema undangan (contoh: 'jawa_danang_sekar')
 * @param {object} data - { nama, kehadiran, ucapan }
 * @returns {Promise}
 */
window.submitRSVPToCloud = async function(themeId, data) {
  const collectionName = 'rsvp_' + (themeId || 'general');
  const payload = {
    nama: data.nama,
    kehadiran: data.kehadiran,
    ucapan: data.ucapan,
    timestamp: new Date().toISOString()
  };

  // Simpan juga ke LocalStorage sebagai backup instan
  try {
    const localKey = 'local_rsvp_' + collectionName;
    const existing = JSON.parse(localStorage.getItem(localKey) || '[]');
    existing.unshift(payload);
    localStorage.setItem(localKey, JSON.stringify(existing.slice(0, 50)));
  } catch (e) {
    console.log('LocalStorage backup error:', e);
  }

  // Jika Firebase aktif, simpan ke Cloud Firestore
  if (window.isFirebaseReady && window.firestoreDb && window.firestoreTools) {
    try {
      const { collection, addDoc, serverTimestamp } = window.firestoreTools;
      await addDoc(collection(window.firestoreDb, collectionName), {
        ...payload,
        createdAt: serverTimestamp()
      });
      console.log('✅ RSVP tersimpan di Firebase Firestore Cloud!');
      return { success: true, source: 'firebase' };
    } catch (err) {
      console.error('Firebase save error:', err);
      return { success: true, source: 'local_fallback', error: err };
    }
  }

  return { success: true, source: 'local' };
};

/**
 * Dengarkan pesan masuk secara Real-time dari Firebase Firestore
 * @param {string} themeId - ID tema undangan
 * @param {function} renderCallback - Callback function(arrayWishes)
 */
window.listenRSVPFromCloud = function(themeId, renderCallback) {
  const collectionName = 'rsvp_' + (themeId || 'general');

  // Load awal dari LocalStorage agar instan tampil
  const localKey = 'local_rsvp_' + collectionName;
  try {
    const localData = JSON.parse(localStorage.getItem(localKey) || '[]');
    if (localData.length > 0 && renderCallback) {
      renderCallback(localData);
    }
  } catch (e) {}

  const setupListener = () => {
    if (window.isFirebaseReady && window.firestoreDb && window.firestoreTools) {
      const { collection, onSnapshot, query, orderBy, limit } = window.firestoreTools;
      try {
        const q = query(
          collection(window.firestoreDb, collectionName),
          orderBy('createdAt', 'desc'),
          limit(50)
        );
        onSnapshot(q, (snapshot) => {
          const list = [];
          snapshot.forEach((doc) => {
            list.push(doc.data());
          });
          if (list.length > 0 && renderCallback) {
            renderCallback(list);
          }
        }, (err) => {
          console.warn('Firebase snapshot listener error:', err);
        });
      } catch (err) {
        console.warn('Listener setup error:', err);
      }
    }
  };

  if (window.isFirebaseReady) {
    setupListener();
  } else {
    window.onFirebaseReadyCallback = setupListener;
  }
};
