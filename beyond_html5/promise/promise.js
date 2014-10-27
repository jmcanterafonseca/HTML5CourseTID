var Module = (function() {
  function retrieveResource(url) {
    console.log('Retrieving resource');

    if (!url) {
      return Promise.reject({
        name: 'InvalidURL'
      })
    }

    return new Promise(function(resolve, reject) {
      var request = new XMLHttpRequest();

      request.open('GET', url);

      request.onload = function() {
        console.log('Loaded!');
        resolve(request.responseText);
      }

      request.onerror = function() {
        console.log('Error: !');
        reject({
          name: 'XHRError'
        });
      }

      request.send();
    });
  }

  return {
    get: retrieveResource
  }
})();


var serviceURL = 'http://maps.googleapis.com/maps/api/geocode/json';

function error(err) {
  console.error('Error: ', err.name);
}

function doIt() {
  var addressURL = serviceURL + '?' +
                  'address=1600+Amphitheatre+Parkway,+Mountain+View,+CA';

  Module.get(addressURL).then(function success(data) {
    console.log('Data: ', data);
  }, error);
}

function doMultiple() {
  var operations = [];
  var op1url = serviceURL + '?latlng=40.714224,-73.961452';
  operations.push(Module.get(op1url));
  var op2url = serviceURL + '?latlng=40,4';
  operations.push(Module.get(op2url));

  Promise.all(operations).then(function success(results) {
    console.log('Result 1:', results[0]);
    console.log('Result 2:', results[1]);
  }, error);
}

function doOneThenAnother() {
  var op1url = serviceURL + '?latlng=40.714224,-73.961452';
  Module.get(op1url).then(function success(data1) {
    console.log('Result 1:', data1);
    var op2url = serviceURL + '?latlng=40,4';
    return Module.get(op2url);
  }, error).then(function success(data2) {
    console.log('Result 2:', data2);
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

function doReject() {
  var url = serviceURL + '?latlng=40.714224,-73.961452';
  Module.get(url).then(function success(data) {
    console.log('Success called!!', xxx.xxx);
  }).catch(function error(err) {
      console.log('Error: ', err && err.name);
  });
}

function doRace() {
  var p1 = new Promise(function(resolve, reject) {
    setTimeout(resolve, 500, "one");
  });
  var p2 = new Promise(function(resolve, reject) {
    setTimeout(resolve, 100, "two");
  });

  Promise.race([p1, p2]).then(function(value) {
    console.log('Value: ', value);
  });
}

function doTest() {
  var op1url = serviceURL + '?latlng=40.714224,-73.961452';

  Module.get('').then(function success(data) {
    console.log('Data: ', data);
    return Module.get('');
  }).then(function() {
      console.log('This code should not be executed');
  }).catch(function(err) {
      console.error('Failure: ', err);
  });
}

function doTest2() {
  var op1url = serviceURL + '?latlng=40.714224,-73.961452';

  Module.get(op1url).then(function success(data) {
    console.log('Data: ', data);
  }).then(function() {
      console.log('Another then: ');
  });
}


function load() {
  return new Promise(function(resolve, reject) {
    setTimeout(reject, 100, 'hola');
  });
}

function contactIce() {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, 200, 'adios');
  });
}

function checkContact() {
  return load().then(function() {
    return contactIce();
  }/*, function(err) {
      alert('other error called');
  }*/);
}

function doTest21() {
  checkContact().then(function() {
    console.log('Then called!!!');
  }, function(str) {
      console.error('Error called: ', str);
      alert('Error called: ' + str);
  });
}

function doTest31() {
  load().then(function() {
    alert('loaded');
  }, function() {
      alert('error31');
  });
}
