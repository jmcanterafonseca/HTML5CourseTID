'use strict';

importScripts('vendor/serviceworker-cache-polyfill.js');

console.log('SW started');

this.addEventListener('install', function(event) {
  event.waitUntil(cachesPolyfill.open('myapp-static-v1').then(function(cache) {
    console.log('Adding to the cache');
    return cache.add('/star-wars-logo.jpg');
  }));
  console.log('Service Worker have been installed');
});

this.addEventListener('activate', function(event) {
  console.log('Service Worker activated');
});

this.addEventListener('fetch', function(event) {
  console.log("Caught a fetch!");

  var cachedResponse = cachesPolyfill.match(event.request).catch(function() {
    return new Response("Hello world!");
  });

  event.respondWith(cachedResponse);
});
