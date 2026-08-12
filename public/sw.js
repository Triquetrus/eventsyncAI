self.addEventListener('push', (event) => {
  const payload = event.data ? event.data.json() : {};
  const title = payload.title || 'EventSync AI';
  const options = {
    body: payload.message || 'You have a new event reminder.',
    icon: '/icon.svg',
    badge: '/icon.svg',
    data: { url: '/' },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data?.url || '/'));
});
