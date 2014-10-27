if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/worker.js', {
    scope: 'a/*'
  }).then(function(sw) {
      alert('SW registered');
  }).catch(function(err) {
      alert('Registration failed: ' + err.name);
  });
}
