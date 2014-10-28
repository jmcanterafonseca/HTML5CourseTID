'use strict';

importScripts('vendor/serviceworker-cache-polyfill.js');

console.log('SW started');

caches = cachesPolyfill;

this.addEventListener('install', function(event) {
  event.waitUntil(caches.open('myapp-static-v2').then(function(cache) {
    console.log('Adding to the cache');
    return cache.add('images/star-wars-logo.jpg');
  }));
  console.log('Service Worker have been installed');
});

this.addEventListener('activate', function(event) {
  console.log('Service Worker activated');
});

this.addEventListener('fetch', function(event) {
  console.log("Caught a fetch!");

  var request = event.request;

  if (request.url.indexOf('star-wars-logo.jpg') !== -1) {
    event.respondWith(caches.match('images/star-wars-logo.jpg'));
    return;
  }

  fetch(request).then(function(response) {
    if(response.status === 200) {
      event.respondWith(response);
    }
    else {
      event.respondWith(new Response('Resource not available'));
    }
  }, function(err) {
      console.error('Error while fetching resource', err);
      event.respondWith(
              new Response('You are offline'));
  });
});
