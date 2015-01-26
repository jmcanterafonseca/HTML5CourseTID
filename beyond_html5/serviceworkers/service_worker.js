'use strict';

document.getElementById('register').addEventListener('click', registerSW);

function showMsg(msg) {
  document.querySelector('p').textContent += msg;
}

function registerSW() {
  showMsg('Registering ...');

  if (navigator.serviceWorker) {
    navigator.serviceWorker.register('worker.js', {
      scope: 'myapp/'
    }).then(function(registration) {
        showMsg('SW registered under scope: ' + registration.scope);
        if (registration.installing) {
          registration.installing.postMessage('hello!!');
        }
    }).catch(function(err) {
        showMsg('Registration failed: ' + err.name);
    });

    // This not called yet by Google Chrome's implementation
    navigator.serviceWorker.ready.then(function() {
      showMsg('SW is now in the active state');
    });
  }
  else {
    showMsg('Service Worker interfaces not even present');
  }
}
