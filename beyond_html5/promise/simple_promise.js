var serviceURL = 'http://maps.googleapis.com/maps/api/geocode/json';

function error(err) {
  error('Error: ', err.name);
}

function doIt() {
  var addressURL = serviceURL + '?' +
                  'address=1600+Amphitheatre+Parkway,+Mountain+View,+CA';

  Module.get(addressURL).then(function success(data) {
    log('Data: ', data);
  }, error);
}

function doMultiple() {
  var operations = [];
  var op1url = serviceURL + '?latlng=40.714224,-73.961452';
  operations.push(Module.get(op1url));
  var op2url = serviceURL + '?latlng=40,4';
  operations.push(Module.get(op2url));

  Promise.all(operations).then(function success(results) {
    log('Result 1:', results[0]);
    log('Result 2:', results[1]);
  }, error);
}

function doOneThenAnother() {
  var op1url = serviceURL + '?latlng=40.714224,-73.961452';
  Module.get(op1url).then(function success(data1) {
    console.log('Result 1:', data1);
    var op2url = serviceURL + '?latlng=40,4';
    return Module.get(op2url);
  }, error).then(function success(data2) {
    log('Result 2:', data2);
  }, error);
}

function doManySequential() {
  var list = [serviceURL + '?latlng=40.714224,-73.961452',
              serviceURL + '?latlng=40,4',
              serviceURL + '?latlng=35.567,-74.987'];

  var sequence = Promise.resolve();

  list.forEach(function(aURL) {
    sequence = sequence.then(function() {
      return Module.get(aURL);
    }).then(function(data) {
        console.log('Data: ', data);
    });
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
