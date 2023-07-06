import { initializeApp } from "firebase/app";
import {getAuth , GoogleAuthProvider} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAB6yMDXXIrVjiGcc3jBb0G5RwGX04aMJk",
  authDomain: "blog-wb-app.firebaseapp.com",
  projectId: "blog-wb-app",
  storageBucket: "blog-wb-app.appspot.com",
  messagingSenderId: "988084376220",
  appId: "1:988084376220:web:1eb87f5cb339d20b221359",
  measurementId: "G-HXWBFZDDGL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
