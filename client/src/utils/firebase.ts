import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
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

export const functions = getFunctions(app);
// Initialize Firebase Authentication
export const auth = getAuth(app);
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, `http://${window.location.hostname}:9099`);
  connectFirestoreEmulator(db, window.location.hostname, 8080);
  connectFunctionsEmulator(functions, window.location.hostname, 5001);
}
export default app;
