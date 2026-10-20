// ============================================================
//  KONFIGURASI FIREBASE
//  (Firebase Console → Project settings → General → Your apps)
//  Nilai ini memang publik; keamanan data diatur firestore.rules.
//  Selama apiKey masih 'ISI_…', RSVP berjalan dalam mode demo (localStorage).
// ============================================================
export const firebaseConfig = {
  apiKey: 'ISI_API_KEY',
  authDomain: 'ISI_PROJECT_ID.firebaseapp.com',
  projectId: 'ISI_PROJECT_ID',
  storageBucket: 'ISI_PROJECT_ID.firebasestorage.app',
  messagingSenderId: 'ISI_SENDER_ID',
  appId: 'ISI_APP_ID',
};
