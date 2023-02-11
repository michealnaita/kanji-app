import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyB2AGh472uPLR7MfX938iZGkal1O4qqIrA',
  authDomain: 'kanji-app-a5036.firebaseapp.com',
  projectId: 'kanji-app-a5036',
  storageBucket: 'kanji-app-a5036.appspot.com',
  messagingSenderId: '692991254690',
  appId: '1:692991254690:web:01a654b3cfddcb855437fb',
  measurementId: 'G-FZX14ND2MJ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);
if (/localhost|192\.168\.0\.115/.test(window.location.host)) {
  connectAuthEmulator(auth, 'http://192.168.0.115:9099');
  connectFirestoreEmulator(db, '192.168.0.115', 8080);
}
if (/41\.190\.133\.177/.test(window.location.host)) {
  connectAuthEmulator(auth, 'http://41.190.133.177:9099');
  connectFirestoreEmulator(db, '41.190.133.177', 8080);
}
export default app;
