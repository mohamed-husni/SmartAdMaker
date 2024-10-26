import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
console.log('Firebase API Key:', process.env.REACT_APP_FIREBASE_API_KEY);
const firebaseConfig = {
  apiKey: "AIzaSyBqrq1A2Nst9hF3t7DLw-k8sZIXcmAvIiE",
  authDomain: "ai-app-7f653.firebaseapp.com",
  projectId: "ai-app-7f653",
  storageBucket: "ai-app-7f653.appspot.com",
  messagingSenderId: "157053047400",
  appId: "1:157053047400:web:71b0e6077700fbe93ae1dd",
  measurementId: "G-H45FCL20S3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


export { db,auth };

