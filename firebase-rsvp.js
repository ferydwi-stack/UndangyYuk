/**
 * UNDANGYUK - FIREBASE CLOUD FIRESTORE RSVP & WISHES SYNC
 * Centralized Real-time RSVP & Guestbook Handler with LocalStorage Fallback
 */

// 1. KONFIGURASI FIREBASE RESMI (PROJECT: UNDANG-YUK)
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyA1jOD-xmZc_8vSfUa7eQfuqYDTCoWXnDc",
  authDomain: "undang-yuk.firebaseapp.com",
  databaseURL: "https://undang-yuk-default-rtdb.firebaseio.com",
  projectId: "undang-yuk",
  storageBucket: "undang-yuk.firebasestorage.app",
  messagingSenderId: "699815928750",
  appId: "1:699815928750:web:5d6bd962520ea35f801e3f",
  measurementId: "G-BFWY0CP7XH"
};

// 2. INITIALIZE FIREBASE SDK (Firestore)
let firestoreDb = null;
let isFirebaseReady = false;

(function initFirebaseRSVP() {
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
        console.log("🔥 Firebase Firestore Cloud (undang-yuk) terhubung sukses!");
        
        // Trigger live listener if template has initialized
        if (window.onFirebaseReadyCallback) {
          window.onFirebaseReadyCallback();
        }
      } catch (err) {
        console.warn("Firebase initialization warning:", err);
      }
    `;
    document.head.appendChild(scriptApp);
  }
})();

/**
 * Kirim RSVP ke Firebase Firestore (atau LocalStorage jika offline)
 * @param {string} themeId - ID tema undangan (contoh: 'jawa_kasultanan')
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

  // Simpan ke Cloud Firestore Real-time
  if (window.isFirebaseReady && window.firestoreDb && window.firestoreTools) {
    try {
      const { collection, addDoc, serverTimestamp } = window.firestoreTools;
      await addDoc(collection(window.firestoreDb, collectionName), {
        ...payload,
        createdAt: serverTimestamp()
      });
      console.log('✅ RSVP tersimpan di Firebase Firestore Cloud (undang-yuk)!');
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
