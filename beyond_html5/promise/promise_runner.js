// Some auxiliary objects

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

// Improves Promise.all by reporting the individual results as soon as they
// are ready
function doPromiseAllImproved1() {
  clear();

  var t1 = new TimerTask(4000);
  var t2 = new TimerTask(1000);

  var promises = [
    t1.run(),
    t2.run()
  ];

  var executionData = Promise.all2(promises);

  executionData.all.then(function(results) {
    log('Promise.all finished');
  });

  for(var p of executionData.futures) {
    p.then(function(r) {
      log('Done!!', r.subject, r.result);
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

  for (var p of executionData.futures) {
    p.then(function(r) {
      log('Done!!', r.subject, r.result);
    }, function rejected(r) {
        error('Error: ', r.subject, r.error.name);
    });
  }
}

function doPromiseParallel() {
  var list = [serviceURL + '?latlng=40.416646, -3.703818',
              serviceURL + '?latlng=38.921667, 1.293333',
              serviceURL + '?latlng=39.842222, 3.133611'];

  var aux = list.map(function(item) {
    return new FetchTask(item);
  });

  var runnables = [
    new TimerTask(4000),
    new TimerTask(1000),
    aux[0],
    new TimerTask(1000),
    aux[1],
    aux[2]
  ];

  // Executes in batches of 2
  var executionData = Promise.parallel(runnables);

  executionData.all.then(function(data) {
    // Code executed when all the futures have finished
    log('*** Everything finished ***');

    data.results.forEach(function(aResult, index) {
      if (aResult) {
        log('Result: ', index, typeof aResult === 'object' ?
            aResult.results[0].formatted_address : aResult);
      }
      else {
        error('Error: ', index, data.errors[index].name);
      }
    });
  });

  var resultHandler = function(r) {
    if (typeof r.result === 'object') {
      log('Done!!', r.subject, r.result.results[0].formatted_address);
      return;
    }
    log('Done!!', r.subject, r.result);
  }

  for(var p of executionData.futures) {
    p.then(resultHandler, function rejected(r) {
        error('Error: ', r.subject, r.error.name);
    });
  }
}
