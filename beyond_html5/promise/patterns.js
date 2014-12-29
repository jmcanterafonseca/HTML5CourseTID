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
    window.setTimeout(resolve, this.duration);
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

function doManySequential2() {
  var list = [serviceURL + '?latlng=40.714224,-73.961452',
              serviceURL + '?latlng=40,4',
              serviceURL + '?latlng=35.567,-74.987'];


}
