// Service Worker for Voice to Minister - Papanasam - Push Notifications
const CACHE_NAME = 'voice-to-minister-ppn-v1';

// Install event
self.addEventListener('install', (event) => {
    console.log('🔔 Service Worker installed');
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('🔔 Service Worker activated');
    event.waitUntil(clients.claim());
});

// Push notification received
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    
    const options = {
        body: data.body || 'புதிய அறிவிப்பு உள்ளது!',
        icon: '/assets/logo.svg',
        badge: '/assets/logo.svg',
        vibrate: [200, 100, 200],
        tag: 'minister-update',
        renotify: true,
        data: {
            url: data.url || '/demo/index.html'
        },
        actions: [
            { action: 'open', title: 'பார்க்க' },
            { action: 'dismiss', title: 'புறக்கணி' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title || '🟢 Voice to Minister - Papanasam Update', options)
    );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'dismiss') return;
    
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(clientList => {
            for (const client of clientList) {
                if (client.url.includes('/demo/') && 'focus' in client) {
                    return client.focus();
                }
            }
            return clients.openWindow('/demo/index.html');
        })
    );
});
