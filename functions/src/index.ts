/* eslint-disable max-len */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

exports.sendNotificationOnLike = functions.firestore
  .document("notifications/{notificationId}")
  .onCreate(async (snapshot, context) => {
    console.log("sendNotificationOnLike");
    const notification = snapshot.data();
    const notificationId = context.params.notificationId;

    // Get the user's FCM token
    const userRef = admin.firestore().collection("users").doc(notification.receiverId);
    const userDoc = await userRef.get();
    const fcmToken = userDoc?.data()?.fcmToken;

    // Send a browser notification
    const payload = {
      notification: {
        title: "New Like",
        body: ` post has been liked by ${notification.content}`,
      },
      data: {
        notificationId: notificationId,
      },
    };

    const message = {
      token: fcmToken,
      ...payload,
    };

    return admin.messaging().send(message);
  });
