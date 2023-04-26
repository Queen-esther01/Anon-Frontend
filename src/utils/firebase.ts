import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging"
import * as Sentry from '@sentry/react'

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

//Access Firebase cloud messaging
const messaging = getMessaging(firebaseApp);

/*
This function allows us to get your device token from Firebase 
which is required for sending Push notifications to your device.
*/
function requestPermission() {
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            //console.log('Notification permission granted.');
        }
        else {
            //console.log('Notification permission denied')
        }
    })
}

export const getTokenFromFirebase = () => {
    return getToken(messaging, {
        vapidKey: import.meta.env.VITE_VAPID_KEY,
    })
    .then((currentToken) => {
        if (currentToken) {
            //console.log("current token for client: ", currentToken);
            //send token to backend
            return currentToken
        } else {
            // console.log(
            //     "No registration token available. Request permission to generate one."
            // );
            requestPermission()
        }
    })
    .catch((err) => {
        //console.log("An error occurred while retrieving token. ", err);
        Sentry.setContext("Failed Share", {
            data: err,
            error: JSON.stringify(err),
            page: 'Firebase'
        });
        Sentry.captureException(err)
    });
};

// onMessage(messaging, (payload) => {
//     console.log(payload);
// });


// export const onMessageListener = () =>
//     new Promise((resolve) => {
//         onMessage(messaging, (payload) => {
//             console.log(payload);
//             resolve(payload);
//         });
//     });
