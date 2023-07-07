import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken , onMessage } from 'firebase/messaging';
const firebaseConfig = {
  apiKey: "AIzaSyAB6yMDXXIrVjiGcc3jBb0G5RwGX04aMJk",
  authDomain: "blog-wb-app.firebaseapp.com",
  projectId: "blog-wb-app",
  storageBucket: "blog-wb-app.appspot.com",
  messagingSenderId: "988084376220",
  appId: "1:988084376220:web:1eb87f5cb339d20b221359",
  measurementId: "G-HXWBFZDDGL",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
const messaging = getMessaging(app);

export const requestForToken = () => {
    console.log('Requesting permission...');
    return getToken(messaging, { vapidKey: 'BMo49QOdNMY0Skt5Hegqw3JZxPnKF2KH_q9lX7oscXpzee0PzNwDau72ZoKC1LJu0sg6vJdTnqON2B1dqfcp1TQ' })
      .then((currentToken) => {
        if (currentToken) {
          console.log('current token for client: ', currentToken);
          // Perform any other neccessary action with the token
        } else {
          // Show permission request UI
          console.log('No registration token available. Request permission to generate one.');
        }
      })
      .catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
      });
  };

  export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("payload", payload)
      resolve(payload);
    });
  });