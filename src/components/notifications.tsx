import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

async function markNotificationAsSeen(notificationId: string) {
  const notificationRef = doc(db, 'notifications', notificationId);
  await updateDoc(notificationRef, { seen: true });
}

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
            const toastId = toast(notification.content, {
              onClick: async () => {
                await markNotificationAsSeen(notification.id);
                setNotifications(notifications.filter((notif: { id: string; }) => notif.id !== notification.id));
                toast.dismiss(toastId);
              },
            });
          });
        });

        // Clean up the listener when the component is unmounted
        return () => unsubscribe();
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      {/* Your other components and UI elements */}
      <ToastContainer />
    </div>
  );
};

export default NotificationsComponent;