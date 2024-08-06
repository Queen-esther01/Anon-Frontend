// import { initializeApp } from "@firebase/app";
// import { getMessaging } from "@firebase/messaging";
// import { onBackgroundMessage } from "firebase/messaging/sw";
// import { firebaseConfig } from '../src/utils/firebase'
// const getMessaging = require("firebase/messaging/sw")
// const firebaseConfig = require("../src/utils/firebase")
// Scripts for firebase and firebase messaging
// importScripts(
//     "https://www.gstatic.com/firebasejs/9.20.0/firebase-app-compat.js"
// );
// importScripts(
//     "https://www.gstatic.com/firebasejs/9.20.0/firebase-messaging-compat.js"
// );


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "AIzaSyAZPfYeUnysBz1DM6mUOipjhvrKBxwFZXs",
//     authDomain: "anon-5cef0.firebaseapp.com",
//     projectId: "anon-5cef0",
//     storageBucket: "anon-5cef0.appspot.com",
//     messagingSenderId: "804819592645",
//     appId: "1:804819592645:web:163f16d31ce9525df197ac",
//     measurementId: "G-JYRPD3PKKR"
// }

// const firebaseApp = initializeApp(firebaseConfig);
// const messaging = getMessaging(firebaseApp);

self.addEventListener("push", (event) => {
	console.log(event)
	console.log(event.data)
	console.log(event.data.json())
	const data = event.data.json();

	self.registration.showNotification(data.notification.title, {
		body: data.notification.body || "",
		image: "https://pixabay.com/vectors/bell-notification-communication-1096280/",
		icon: "https://res.cloudinary.com/tinkerbell/image/upload/v1682185418/incognito_j8wzfs.png",
		description: data.description || "",
		actions: data.actions || [],
	});
});
// self.onBackgroundMessage((payload) => {
//     //console.log(navigator)
//     //console.log("Received background message ", payload);
//     const notificationTitle = payload.notification.title;
//     const notificationOptions = {
//         body: payload.notification.body,
//         icon: 'https://res.cloudinary.com/tinkerbell/image/upload/v1682185418/incognito_j8wzfs.png',
//         badge: 'https://res.cloudinary.com/tinkerbell/image/upload/c_scale,w_72/v1682185418/incognito_j8wzfs.png'
//     };
//     self.registration.showNotification(notificationTitle, notificationOptions);
// });

self.addEventListener('notificationclick', function(event) {
    let url = 'http://localhost:5173/app/messages';
    event.notification.close(); // Android needs explicit close.
    event.waitUntil(
        clients.matchAll({includeUncontrolled: true, type: 'window'}).then( windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                // If so, just focus it.
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, then open the target URL in a new window/tab.
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});