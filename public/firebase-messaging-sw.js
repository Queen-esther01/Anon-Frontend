
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