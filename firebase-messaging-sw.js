// import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging/sw";
import { onBackgroundMessage } from "firebase/messaging/sw";
// Scripts for firebase and firebase messaging
// importScripts(
//     "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
// );
// importScripts(
//     "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
// );



const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = getMessaging();

onBackgroundMessage(messaging, (payload) => {
    //console.log(navigator)
    //console.log("Received background message ", payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'https://res.cloudinary.com/tinkerbell/image/upload/v1682185418/incognito_j8wzfs.png',
        badge: 'https://res.cloudinary.com/tinkerbell/image/upload/c_scale,w_72/v1682185418/incognito_j8wzfs.png'
    };
    
 
        // navigator.serviceWorker.register("firebase-messaging-sw.js")
        // navigator.serviceWorker.ready.then((registration) => {
        //     registration.showNotification(notificationTitle, notificationOptions);
        //     console.log("Registration successful, scope is:", registration.scope);
        //   })
        //   .catch((err) => {
        //     console.log("Service worker registration failed, error:", err);
        //   });
    //   if(typeof window !=='undefined' && window.location){
    //     self.registration.showNotification(notificationTitle, notificationOptions);
    //   }
    self.registration.showNotification(notificationTitle, notificationOptions);
});

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