// Improves Promise.all by reporting the individual results as soon as they
// are ready
Promise.all2 = function(futures) {
  return {
    all: Promise.all(futures),
    futures: aGen(futures)
  }
}

// auxiliary generator from Promise.all2 and Promise.all3
function* aGen(futures, futureHandler) {
  for(var j = 0; j < futures.length; j++) {
    var newP = new Promise(function(index, resolve, reject) {
      futures[index].then(function(res) {
        futureHandler && futureHandler.oncompleted(index, res);
        resolve({
          subject: index,
          result: res
        });
      }, function(err) {
          futureHandler && futureHandler.onerror(index, err);
          reject({
            subject: index,
            error: err
          });
      });
    }.bind(null, j));

    yield newP;
  }
}

// Executes all the futures regardless the error conditions
Promise.all3 = function(futures) {
  var futureHandler = {
    numResponses: 0,
    errors: [],
    results: [],
    totalCalls: futures.length,

    oncompleted: function(index, result) {
      this.results[index] = result;
      this.numResponses++;
      this._doResolve();
    },
    onerror: function(index, err) {
      this.results[index] = null;
      this.errors[index] = err;
      this.numResponses++;
      this._doResolve();
    },

    _doResolve: function() {
      if (this.numResponses === this.totalCalls &&
          typeof this.resolutionFunction === 'function') {
        window.setTimeout(this.resolutionFunction, 0, {
          errors: this.errors,
          results: this.results
        });
      }
    },

    set resolver(r) {
      this.resolutionFunction = r;
      this._doResolve();
    }
  };

  var allPromise = new Promise(function(resolve, reject) {
    futureHandler.resolver = resolve;
  });

  return {
    all: allPromise,
    futures: aGen(futures, futureHandler)
  }
}

// Promise.parallel executes the list of runnables in batches which are
// transparent to the developer
Promise.parallel = function(runnables, batchSize) {
  const DEFAULT_BATCH_SIZE = 2;
  var batchSize = Math.min(batchSize || DEFAULT_BATCH_SIZE, runnables.length);

  var futureHandler = {
    numResponses: 0,
    errors: [],
    results: [],
    totalCalls: runnables.length,
    promiseResolvers: [],
    nextToRun: batchSize,

    oncompleted: function(index, result) {
      this.results[index] = result;
      this.numResponses++;
      this._doResolve();
    },
    onerror: function(index, err) {
      this.results[index] = null;
      this.errors[index] = err;
      this.numResponses++;
      this._doResolve();
    },

    _checkFinish: function() {
      if (this.numResponses === this.totalCalls &&
          typeof this.resolutionFunction === 'function') {
        window.setTimeout(this.resolutionFunction, 0, {
          errors: this.errors,
          results: this.results
        });
      }
    },

    _doResolve: function() {
      this._checkFinish();

      var nextToRun = this.nextToRun++;
      if (nextToRun >= runnables.length) {
        return;
      }
      console.log('Next to run: ', nextToRun);

      runnables[nextToRun].run().then(function(idx, result) {
        var resolver = this.promiseResolvers[idx];
        resolver && resolver.resolve({
          subject: idx,
          result: result
        });
        this.oncompleted(idx, result);
      }.bind(this, nextToRun), function(idx, err) {
        var resolver = this.promiseResolvers[idx];
        resolver && resolver.reject({
          subject: idx,
          error: err
        });
        this.onerror(idx, err);
      }.bind(this, nextToRun));
    },

    set resolver(r) {
      this.resolutionFunction = r;
      // Check if by the time we have the resolver everything was resolved
      this._checkFinish();
    },

    setPromiseResolver: function(index, resolve, reject) {
      // If by the time we call this function the corresponding promise was
      // already resolved, then call directly resolve or reject
      if (typeof this.results[index] !== 'undefined') {
        resolve(this.results[index]);
        return;
      }

      if (typeof this.errors[index] !== 'undefined') {
        reject(this.errors[index]);
        return;
      }

      this.promiseResolvers[index] = {
        resolve: resolve,
        reject: reject
      };
    }
  };

  var allPromise = new Promise(function(resolve, reject) {
    futureHandler.resolver = resolve;
  });

  return {
    all: allPromise,
    futures: parallelGen(runnables, batchSize, futureHandler)
  }
}

// Auxiliary generator for Promise.parallel
function* parallelGen(runnables, batchSize, futureHandler) {
  // Initially only the the first batch is launched
  for(var j = 0; j < batchSize; j++) {
    var newPromise = new Promise(function(index, resolve, reject) {
      runnables[j].run().then(function(result) {
        resolve({
          subject: index,
          result: result
        });
        futureHandler.oncompleted(index, result);
      }, function(err) {
          reject({
            subject: index,
            error: err
          })
      });
    }.bind(null, j));

    yield newPromise;
  }

  for(var v = batchSize; v < runnables.length; v++) {
    var promise = new Promise(function(index, resolve, reject) {
      futureHandler.setPromiseResolver(index, resolve, reject);
    }.bind(null, v));

    yield promise;
  }
}

// Run the passed runnables sequentially
Promise.sequential = function(runnables) {
  return new Promise(function(resolve, reject) {
    var results = [];

    runnables.reduce(function(sequence, aRunnable) {
      return sequence.then(function() {
        return aRunnable.run();
      }).then(function(data) {
          results.push(data);
          if (results.length === runnables.length) {
            resolve(results);
          }
      });
    }, Promise.resolve());
  });
}

Promise.sequential2 = function(runnables) {
  return Promise.parallel(runnables, 1);
}
