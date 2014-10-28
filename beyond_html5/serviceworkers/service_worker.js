'use strict';

document.getElementById('register').addEventListener('click', registerSW);

function showMsg(msg) {
  document.querySelector('p').textContent = msg;
}

function registerSW() {
  showMsg('Registering ...');

  if (navigator.serviceWorker) {
    var t = Date.now();
    navigator.serviceWorker.register('worker.js?t=' + t, {
      scope: 'myapp/'
    }).then(function(sw) {
        showMsg('SW registered');
    }).catch(function(err) {
        showMsg('Registration failed: ' + err.name);
    });
  }
  else {
    showMsg('Service Worker interfaces not even present');
  }
}
