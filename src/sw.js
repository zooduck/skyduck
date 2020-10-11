/* eslint-disable no-console */
import 'regenerator-runtime/runtime';
import package from '../package.json';

const CACHE_NAME = `cache-v${package.version}`;
const preCacheList = [
    '/',
    'index.html',
    'manifest.webmanifest'
];

const cleanCache = async () => {
    const expiredCaches = await caches.keys();
    const cacheDeletePromises = expiredCaches.map((expiredCacheName) => {
        return caches.delete(expiredCacheName);
    });

    return Promise.all(cacheDeletePromises);
};

const preCache = async () => {
    return caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(preCacheList);
    });
};

const postMessageToController = async (message) => {
    const clients = await self.clients.matchAll();

    clients.forEach((client) => {
        client.postMessage(message);
    });
};

self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');

    self.skipWaiting();

    event.waitUntil(
        cleanCache().then(() => {
            preCache();
        })
    );
});

self.addEventListener('activate', () => {
    console.log('Service Worker activating...');

    postMessageToController('activated');
});

self.addEventListener('fetch', (event) => {
    event.respondWith(caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
    }));
});
