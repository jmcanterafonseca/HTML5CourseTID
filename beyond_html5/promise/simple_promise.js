var serviceURL = 'http://maps.googleapis.com/maps/api/geocode/json';

function error(err) {
  error('Error: ', err.name);
}

// Introduces a delay of 'timeout' miliseconds
function delay(timeout) {
  return new Promise(function(resolve, reject) {
    window.setTimeout(resolve, timeout);
  });
}

function doIt() {
  clear();

  var addressURL = serviceURL + '?' +
                  'address=1600+Amphitheatre+Parkway,+Mountain+View,+CA';

  Module.get(addressURL).then(function success(data) {
    log('Data: ', JSON.stringify(data));
  }, error);
}

function doPromiseAll() {
  clear();

  var coordinates = [
                     '?latlng=40.416646, -3.703818',
                     '?latlng=38.921667, 1.293333'
                    ];

  var operations = coordinates.map(function(aCoordinate) {
    return Module.get(serviceURL + aCoordinate);
  });

  operations.push(delay(4000));

  Promise.all(operations).then(function success(responses) {
    log('Result 1:', responses[0].results[0].formatted_address);
    log('Result 2:', responses[1].results[0].formatted_address);
  }, error);
}

function doPromiseRace() {
  clear();

  var coordinates = [
                     '?latlng=40.416646, -3.703818',
                     '?latlng=38.921667, 1.293333'
                    ];

  var operations = coordinates.map(function(aCoordinate) {
    return Module.get(serviceURL + aCoordinate);
  });

  operations.push(delay(4000));

  Promise.race(operations).then(function success(response) {
    if (response) {
      log('First Response: ', response.results[0].formatted_address);
    }
    else {
      log('The remote operations took more than 4 seconds');
    }
  }, error);
}

function doPromiseChain() {
  clear();

  var op1url = serviceURL + '?latlng=39.842222, 3.133611';
  var op2url = serviceURL + '?latlng=41.651944, -4.728333';

  Module.get(op1url).then(function success(data1) {
    log('Result 1:', data1.results[0].formatted_address);
    return delay(4000);
  }, error).then(() => {
    return Module.get(op2url);
  }).then(function success(data2) {
      log('Result 2:', data2.results[0].formatted_address);
  }, error);
}
