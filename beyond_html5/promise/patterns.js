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

Promise.all2 = function(futures) {
  var allPromise = new Promise(function(resolve, reject) {
     Promise.all(futures).then(resolve.bind(null, futures.length), reject);
  });

  return aGen(futures, allPromise);
}

function* aGen(futures, allPromise, futureHandler) {
  for(var j = 0; j < futures.length; j++) {
    var newP = new Promise(function(index, resolve, reject) {
      futures[index].then(function(res) {
        futureHandler.oncompleted(index, res);
        resolve({
          subject: index,
          result: res
        });
      }, function(err) {
          futureHandler.onerror(index, err);
          reject({
            subject: index,
            error: err
          });
      });
    }.bind(null, j));

    yield newP;
  }

  if (allPromise) {
    yield allPromise;
  }
}

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

    _doResolve() {
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
    futures: aGen(futures, null, futureHandler)
  }
}

function FetchTask(url) {
  this.url = url;
}

FetchTask.prototype.run = function() {
  return Module.get(this.url);
}

function TimerTask(duration) {
  this.duration = duration;
}

TimerTask.prototype.run = function() {
  return new Promise(function(resolve, reject) {
    window.setTimeout(resolve.bind(null, this.duration), this.duration);
  }.bind(this));
}

// After five seconds the list of URLs are fetched
function doManySequential() {
  clear();

  var list = [serviceURL + '?latlng=40.416646, -3.703818',
              serviceURL + '?latlng=38.921667, 1.293333',
              serviceURL + '?latlng=39.842222, 3.133611'];

  var runnables = list.map(function(item) {
    return new FetchTask(item);
  });

  var aux = [
              new TimerTask(5000),
            ];
  var runnablesList = aux.concat(runnables);

  Promise.sequential(runnablesList).then(function(dataList) {
    log('Results: ', dataList[1].results[0].formatted_address);
    log('Results: ', dataList[2].results[0].formatted_address);
    log('Results: ', dataList[3].results[0].formatted_address);
  });
}

// After five seconds the list of URLs are fetched
function doManySequential2() {
  clear();

  var list = [serviceURL + '?latlng=40.416646, -3.703818',
              serviceURL + '?latlng=38.921667, 1.293333',
              serviceURL + '?latlng=39.842222, 3.133611'];

  var runnables = list.map(function(item) {
    return new FetchTask(item);
  });

  var aux = [
              new TimerTask(5000),
            ];
  var runnablesList = aux.concat(runnables);

  Promise.sequential(runnablesList).then(function(dataList) {
    log('Results: ', dataList[1].results[0].formatted_address);
    log('Results: ', dataList[2].results[0].formatted_address);
    log('Results: ', dataList[3].results[0].formatted_address);
  });
}

// Improves Promise.all by reporting the individual results
function doPromiseAllImproved1() {
  clear();

  var t1 = new TimerTask(4000);
  var t2 = new TimerTask(1000);

  var promises = [
    t1.run(),
    t2.run()
  ];

  for(var p of Promise.all2(promises)) {
    p.then(function(r) {
      if (promiseIndex === promises.length) {
        log('All is done!!!');
      }
      else {
        log('Done!!', r.subject, r.result);
      }
    });
  }
}

// Executes all the futures regardless the error conditions
function doPromiseAllImproved2() {
  clear();

  var t1 = new TimerTask(4000);
  var t2 = new TimerTask(1000);

  var promises = [
    t1.run(),
    t2.run(),
    Promise.reject({
      name: 'RejectedByDefinition'
    })
  ];

  var executionData = Promise.all3(promises);

  executionData.all.then(function(data) {
    // Code executed when all the futures have finished
    log('*** Everything finished ***');

    data.results.forEach(function(aResult, index) {
      if (aResult) {
        log('Result: ', index, aResult);
      }
      else {
        error('Error: ', index, data.errors[index].name);
      }
    });
  });

  for(var p of executionData.futures) {
    p.then(function(r) {
      log('Done!!', r.subject, r.result);
    }, function rejected(r) {
        error('Error: ', r.subject, r.error.name);
    });
  }
}
