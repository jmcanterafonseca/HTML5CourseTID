function loadURL(url, resolver, timeout) {
  window.setTimeout(function() {
    resolver.accept({url: url});
  }, timeout || 1000);
}

function loadFutureURL(url, resolver) {
  var future = new Future(function(resolver) {
    loadURL(url, resolver, 6000);
  });

  resolver.resolve(future);
}

function retrieveSecondResource() {
  var fut = new Future(function(resolver) {
    loadFutureURL('http://www.facebook.com', resolver);
  });

  return fut;
}

function retrieveThirdResource() {
  var future2 = new Future(function(resolver) {
    loadURL('http://www.yahoo.com', resolver);
  });

  return future2;
}

function retrieveFirstResource() {
  var future1 = new Future(function(resolver) {
    loadURL('http://www.google.com', resolver);
  });

  return future1;
}

function resetUI() {
  document.getElementById('p1').textContent = '';
  document.getElementById('p2').textContent = '';
  document.getElementById('p3').textContent = '';
}

function perform() {
  resetUI();

  retrieveFirstResource().then(function(response) {
    document.getElementById('p1').textContent = 'First resource retrieved: ' + response.url;
    return retrieveSecondResource();
  })
  .then(function(response) {
    document.getElementById('p2').textContent = 'The two resources retrieved: ' + response.url;
    return retrieveThirdResource();
  })
  .done(function(response) {
    document.getElementById('p3').textContent = 'The three resources retrieved: ' + response.url;
  });
}

function perform2() {
  resetUI();

  Future.every(retrieveFirstResource(), retrieveSecondResource(), retrieveThirdResource())
  .done(function(response) {
    document.getElementById('p3').textContent = 'The three resources retrieved: ' + response[0].url +
    ' ' + response[1].url + ' ' + response[2].url;
  });
}
