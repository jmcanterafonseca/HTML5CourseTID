'use strict';

console.log('SW started');

this.addEventListener('install', function(event) {
  event.waitUntil(caches.create('v1').then(function(cache) {
    return cache.add('star-wars-logo.jpg');
  }));

  console.log('Service Worker have been installed');
});

this.addEventListener('fetch', function(event) {
  console.log("Caught a fetch!");

  var cachedResponse = caches.match(event.request).catch(function() {
    return new Response("Hello world!");
  });

  event.respondWith(new Response("Hello world!"));
});
