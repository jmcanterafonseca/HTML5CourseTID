// Promise pattern

// A promise can save us from callback nesting which can be really painful

// Example encapsulating an XMLHttpRequest in a promise
// API example: Rest.load(uri).then(function(response) { }).done(function(lastResponse) {});

function Promise(resolver) {
    var thenCb;
    var doneCb;
    var childPromise;

    var promiseResolution = {
        finished: function(response) {
            if (typeof thenCb === 'function') {
                var thenPromise = thenCb(response);

                if(childPromise) {
                  thenPromise._then = childPromise._then;
                  thenPromise._done = childPromise._done;
                }
                // nextPromise._resolve();
            }
            var theDoneCb = doneCb;
            if (typeof theDoneCb === 'function') {
                window.setTimeout(function() { theDoneCb(response); });
            }
        }
    };

    this.then = function(callback) {
        thenCb = callback;
        childPromise = new Promise();
        return childPromise;
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
