// Promise pattern

// A promise can save us from callback nesting which can be really painful

// Example encapsulating an XMLHttpRequest in a promise
// API example: Rest.load(uri).then(function(response) { }).done(function(lastResponse) {});

function Promise(resolver) {
    var thenCb;
    var doneCb;
    var thenPromise;

    var promiseResolution = {
        finished: function(response) {
            if (typeof thenCb === 'function') {
                var nextPromise = thenCb(response);

                nextPromise._then = thenPromise._then;
                nextPromise._done = thenPromise._done;
                nextPromise._resolve();
            }
            else if (typeof doneCb === 'function') {
                window.setTimeout(function() { doneCb(response); });
            }
        }
    };

    this.then = function(callback) {
        thenCb = callback;
        thenPromise = new Promise();
        return thenPromise;
    };

    this.done = function(callback) {
        doneCb = callback;
    };

    Object.defineProperty(this, '_then', {
      get: function() {
        return thenCb;
      },

      set: function(v) {
        thenCb = v;
      }
    });

    Object.defineProperty(this, '_done', {
      get: function() {
        return doneCb;
      },
      set: function(v) {
        doneCb = v;
      }
    });

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
