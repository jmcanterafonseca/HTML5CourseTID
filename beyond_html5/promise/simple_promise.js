var serviceURL = 'http://maps.googleapis.com/maps/api/geocode/json';

function error(err) {
  error('Error: ', err.name);
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
    return Module.get(aCoordinate);
  });

  Promise.all(operations).then(function success(responses) {
    log('Result 1:', responses[0].results[0].formatted_address);
    log('Result 2:', responses[1].results[0].formatted_address);
  }, error);
}

function doPromiseChain() {
  clear();

  var op1url = serviceURL + '?latlng=39.842222, 3.133611';
  Module.get(op1url).then(function success(data1) {
    log('Result 1:', data1.results[0].formatted_address);
    var op2url = serviceURL + '?latlng=41.651944, -4.728333';
    return Module.get(op2url);
  }, error).then(function success(data2) {
    log('Result 2:', data2.results[0].formatted_address);
  }, error);
}

