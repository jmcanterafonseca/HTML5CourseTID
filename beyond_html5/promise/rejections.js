function rejectMe() {
  return Promise.reject({
    name: 'RejectedByDefinition'
  });
}

function brokenFunction() {
  throw 'broken';
}

function resolveMe() {
  return Promise.resolve('resolved!');
}

function doSimpleReject() {
  clear();

  brokenFunction().then(() => {
    error('It should not be called');
  }, (e) => {
      log('Rejected: ', e.name);
  });
}

function doNoRejectFunction() {
  clear();

  rejectMe().then(() => {
    error('It should not be called');
  });
}

function doCatchFunction() {
  clear();

  brokenFunction().then(() => {
    error('It should not be called');
  }).catch((e) => {
      error('Catched: ', e.name);
  });
}
