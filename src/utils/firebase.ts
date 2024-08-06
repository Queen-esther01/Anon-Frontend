import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging"
import * as Sentry from '@sentry/react'
import { useCookies } from 'react-cookie';

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
// function requestPermission() {
//     Notification.requestPermission().then((permission) => {
//         if (permission === 'granted') {
//             //console.log('Notification permission granted.');
//         }
//         else {
//             //console.log('Notification permission denied')
//         }
//     })
// }

export const getTokenFromFirebase = async () => {

    function registerServiceWorker() {
		return navigator.serviceWorker
		.register("/firebase-messaging-sw.js")
		.then(function (registration) {
			return registration;
		})
		.catch(function (err) {
			console.error("Unable to register service worker.", err);
		});
	}

    function askPermission() {
		let permissionPromise;
		if (!permissionPromise && Notification.permission === "granted") {
			permissionPromise = Promise.resolve(Notification.permission);
		}
		if (!permissionPromise) {
			permissionPromise = new Promise(function (resolve, reject) {
				// Safari uses callback, everything else uses a promise
				var maybePromise = Notification.requestPermission(resolve);
				if (maybePromise) {
					resolve(maybePromise);
				}
			});
		}
		return permissionPromise;
	}

    if ("serviceWorker" in navigator) {
        await registerServiceWorker();

        const permission = await askPermission();
        if (permission !== "granted") return;

        const currentToken = await getToken(messaging, { vapidKey: import.meta.env.VITE_VAPID_KEY })
        .then((token) => {
            return token
        })
        .catch((err) => {
            console.log(err)
            Sentry.setContext("Failed To get Device Token", {
                data: err,
                error: JSON.stringify(err),
                page: 'Firebase'
            });
            Sentry.captureException(err)
        })
        return currentToken
    } else {
        console.error("Service workers are not supported in this browser");
    }

    // return getToken(messaging, {
    //     vapidKey: import.meta.env.VITE_VAPID_KEY,
    // })
    // .then((currentToken) => {
    //     if (currentToken) {
    //         console.log("current token for client: ", currentToken);
    //         //send token to backend
    //         return currentToken
    //     } else {
    //         console.log(
    //             "No registration token available. Request permission to generate one."
    //         );
    //         requestPermission()
    //     }
    // })
    // .catch((err) => {
    //     //console.log("An error occurred while retrieving token. ", err);
    //     Sentry.setContext("Failed Share", {
    //         data: err,
    //         error: JSON.stringify(err),
    //         page: 'Firebase'
    //     });
    //     Sentry.captureException(err)
    // });
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
