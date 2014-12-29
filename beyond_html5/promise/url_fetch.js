'use strict';

var Module = (function() {
  function retrieveResource(url) {
    console.log('Retrieving resource');

    if (!url) {
      return Promise.reject({
        name: 'InvalidURL'
      })
    }

    return new Promise(function(resolve, reject) {
      var request = new XMLHttpRequest();

      request.open('GET', url);

      request.onload = function() {
        console.log('Loaded!');
        resolve(request.responseText);
      }

      request.onerror = function() {
        console.log('Error: !');
        reject({
          name: 'XHRError'
        });
      }

      request.send();
    });
  }

  return {
    get: retrieveResource
  }
})();
