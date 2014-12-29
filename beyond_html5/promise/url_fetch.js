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
      request.responseType = 'json';

      request.onload = function() {
        console.log('Loaded!');
        resolve(request.response);
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
