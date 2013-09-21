// Promise pattern

// A promise can save us from callback nesting which can be really painful

// Example encapsulating an XMLHttpRequest in a promise
// API example: Rest.load(uri).then(function(response) { }).done(function(lastResponse) {});

function Promise(resolver) {
    var thenCb;
    var doneCb;
    var resolutionCb;
    var thenCbs = [];

    var promiseResolution = {
        finished: function(response) {
          if (typeof resolutionCb === 'function') {
            resolutionCb(response);
            return;
          }
          if (thenCbs.length > 0) {
              var thenPromise = thenCbs.shift()(response);
              if (typeof thenPromise._setResolutionCb === 'function' ) {
                thenPromise._setResolutionCb(promiseResolution.finished);
              }
              else {
                throw new Error('A then callback must return a Promise');
              }
          }
          else if (typeof doneCb === 'function') {
              window.setTimeout(function() { doneCb(response); });
          }
        }
    };

    this._setResolutionCb = function(f) {
      resolutionCb = f;
    };

    this.then = function(callback) {
        thenCbs.push(callback);
        return this;
    };

    this.done = function(callback) {
        doneCb = callback;
    };

    this._resolve = function() {
        if (resolver) {
            window.console.log('Promise resolution launched!!');
            window.setTimeout(resolver.bind(null, promiseResolution));
        }
    };

    this._resolve();
}


var Rest = (function() {
    function urlResolver(url, promiseResolution) {
        //
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);

        xhr.onload = function() {
            promiseResolution.finished(xhr.response);
        };

        xhr.send();
    }

    function Rest() {}

    Rest.prototype = {
        load: function(url) {
            return new Promise(urlResolver.bind(null, url));
        }
    };
    return new Rest();
})();
