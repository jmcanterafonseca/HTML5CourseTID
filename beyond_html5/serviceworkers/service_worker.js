'use strict';

document.getElementById('register').addEventListener('click', registerSW);

function registerSW() {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.register('worker.js', {
      scope: 'myapp/'
    }).then(function(sw) {
        alert('SW registered');
    }).catch(function(err) {
        alert('Registration failed: ' + err.name);
    });
  }
  else {
    alert('Service Worker interfaces not even present');
  }
}
