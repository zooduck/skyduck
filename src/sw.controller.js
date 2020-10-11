/* eslint-disable no-console */
const onMessageHandler = (event) => {
    if (event.data === 'activated') {
        location.reload();
    }
};

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then((serviceWorkerRegistration) => {
        console.info(`Service Worker registered with scope: ${serviceWorkerRegistration.scope}`);

        navigator.serviceWorker.addEventListener('message', onMessageHandler);
    }).catch((err) => {
        console.error('Service Worker registration failed', err);
    });
} else {
    console.warn('Service Workers are not supported.');
}
