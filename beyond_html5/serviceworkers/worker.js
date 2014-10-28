'use strict';

console.log('SW started');

console.log(navigator.userAgent);

function getCaches() {
  if (self.caches && navigator.userAgent.indexOf('Chrome') === -1) {
    return self.caches;
  }

  if (!self.cachesPolyfill) {
    importScripts('vendor/serviceworker-cache-polyfill.js');
  }
  return self.cachesPolyfill;
}

self.addEventListener('install', function(event) {
  var caches = getCaches();

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

self.addEventListener('activate', function(event) {
  console.log('Service Worker activated');
});

self.addEventListener('fetch', function(event) {
  var caches = getCaches();

  console.log("Caught a fetch!");

  var request = event.request;

  var url = request.url;

  if (navigator.onLine) {
    console.log('Navigator on line responding with fresh data');
    event.respondWith(fetch(request));

    return;
  }

  console.log('Returning cached data');

  if (url.indexOf('.jpg') !== -1) {
    var resource = url.substring(url.lastIndexOf('/'));
    event.respondWith(caches.match('images' + resource).then(function(response) {
      return response || new Response('Image not available');
    }));
    return;
  }

  event.respondWith(new Response('Do not know how to tell you'));

  /*
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
  */
});
