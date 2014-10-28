'use strict';

importScripts('vendor/serviceworker-cache-polyfill.js');

console.log('SW started');

this.addEventListener('install', function(event) {
  event.waitUntil(cachesPolyfill.open('myapp-static-v2').then(function(cache) {
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
    event.respondWith(cachesPolyfill.match(
                        'images/star-wars-logo.jpg').then(function(response) {
      return response;
    }));
  }

  event.respondWith(new Response('Hello World'))
});
