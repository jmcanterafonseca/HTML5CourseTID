'use strict';

console.log('SW started');

this.addEventListener('install', function(event) {
  console.log('Service Worker have been installed');
});

this.addEventListener('fetch', function(event) {
  console.log("Caught a fetch!");
  event.respondWith(new Response("Hello world!"));
});
