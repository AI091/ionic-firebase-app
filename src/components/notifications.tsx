// Import required packages and components
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';

import { db } from '../../config/firebase';

// Function to request notification permission
async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

// Function to mark notification as seen
async function markNotificationAsSeen(notificationId: string) {
  const notificationRef = doc(db, 'notifications', notificationId);
  await updateDoc(notificationRef, { seen: true });
}

// NotificationsComponent
const NotificationsComponent = () => {
  const [notifications, setNotifications] = useState<any>([]);

  useEffect(() => {
    async function fetchData() {
      const permissionGranted = await requestNotificationPermission();
      if (permissionGranted) {
        const notificationsRef = collection(db, 'notifications');
        const unreadQuery = query(notificationsRef, where('seen', '==', false));

        const unsubscribe = onSnapshot(unreadQuery, (snapshot) => {
          const unreadNotifications: any = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setNotifications(unreadNotifications);
          unreadNotifications.forEach((notification: { id: string; content: any; }) => {
            const browserNotification = new Notification(notification.id, { body: notification.content });
            browserNotification.onclick = async () => {
              await markNotificationAsSeen(notification.id);
              setNotifications(notifications.filter((notif: { id: string; }) => notif.id !== notification.id));
            };
          });
        });

        // Clean up the listener when the component is unmounted
        return () => unsubscribe();
      }
    }

    fetchData();
  }, []);

  // Render the component (not displaying notifications in the UI)
  return (
    <div>
      {/* Your other components and UI elements */}
    </div>
  );
};

export default NotificationsComponent;