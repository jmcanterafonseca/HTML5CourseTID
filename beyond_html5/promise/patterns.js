Promise.sequential = function(runnables) {
  return new Promise(function(resolve, reject) {
    var results = [];
    var sequence = Promise.resolve();

    runnables.forEach(function(aRunnable) {
      sequence = sequence.then(function() {
        return aRunnable.run();
      }).then(function(data) {
          results.push(data);
          if (results.length === runnables.length) {
            resolve(results);
          }
      });
    });
  });
}

function FetchTask(url) {
  this.url = url;
}

FetchTask.prototype.run = function() {
  return Module.get(this.url);
}

function TimerTask(delay) {
  this.delay = delay;
}

TimerTask.prototype.run = function() {
  return new Promise(function(resolve, reject) {
    window.setTimeout(resolve, delay);
  });
}

function doManySequential() {
  var list = [serviceURL + '?latlng=40.714224,-73.961452',
              serviceURL + '?latlng=40,4',
              serviceURL + '?latlng=35.567,-74.987'];

  var runnables = list.map(function(item) {
    return new FetchTask(item);
  });

  runnables.push(new TimerTask(5000));

  Promise.sequential(runnables).then(function(results) {
    log('Results: ', results[0]);
  });
}

function doManySequential2() {
  var list = [serviceURL + '?latlng=40.714224,-73.961452',
              serviceURL + '?latlng=40,4',
              serviceURL + '?latlng=35.567,-74.987'];

  list.reduce(function(sequence, urlToLoad) {
    return sequence.then(function() {
      return Module.get(urlToLoad);
    }).then(function(data) {
      console.log('Data: ', data);
    });
  }, Promise.resolve());
}
