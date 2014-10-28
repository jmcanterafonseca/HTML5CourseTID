'use strict';

importScripts('vendor/serviceworker-cache-polyfill.js');

console.log('SW started');

this.addEventListener('install', function(event) {
  var caches = cachesPolyfill;

  var cacheName = 'myapp-static-v8';

  event.waitUntil(caches.delete(cacheName).then(function() {
    return caches.open(cacheName).then(function(cache) {
      console.log('Adding to the cache');
      return cache.addAll([
        'images/star-wars-logo.jpg',
        'images/telefonica-logo.jpg'
      ]);
    });
  }));

  console.log('Service Worker have been installed');
});

this.addEventListener('activate', function(event) {
  console.log('Service Worker activated');
});

this.addEventListener('fetch', function(event) {
  var caches = cachesPolyfill;

  console.log("Caught a fetch!");

  var request = event.request;

  var url = request.url;

  if (url.indexOf('.jpg') !== -1) {
    var resource = url.substring(url.lastIndexOf('/'));
    event.respondWith(caches.match('images' + resource));
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
