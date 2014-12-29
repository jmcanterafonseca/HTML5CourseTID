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

  var operations = [];
  var op1url = serviceURL + '?latlng=40.416646, -3.703818';
  operations.push(Module.get(op1url));
  var op2url = serviceURL + '?latlng=40,4';
  operations.push(Module.get(op2url));

  Promise.all(operations).then(function success(responses) {
    log('Result 1:', responses[0].results[0].address_components[0].long_name);
    log('Result 2:', responses[1].results[0].address_components[0].long_name);
  }, error);
}

function doPromiseChain() {
  clear();

  var op1url = serviceURL + '?latlng=39.842222, 3.133611';
  Module.get(op1url).then(function success(data1) {
    log('Result 1:', data1.results[0].address_components[0].long_name);
    var op2url = serviceURL + '?latlng=40,4';
    return Module.get(op2url);
  }, error).then(function success(data2) {
    log('Result 2:', data2.results[0].address_components[0].long_name);
  }, error);
}
