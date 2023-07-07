// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyAB6yMDXXIrVjiGcc3jBb0G5RwGX04aMJk",
    authDomain: "blog-wb-app.firebaseapp.com",
    projectId: "blog-wb-app",
    storageBucket: "blog-wb-app.appspot.com",
    messagingSenderId: "988084376220",
    appId: "1:988084376220:web:1eb87f5cb339d20b221359",
    measurementId: "G-HXWBFZDDGL",
  };

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
 // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});