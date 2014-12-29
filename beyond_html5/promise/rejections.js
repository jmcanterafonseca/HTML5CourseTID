function rejectMe() {
  return Promise.reject({
    name: 'RejectByDefinition'
  });
}

function doSimpleReject() {
  clear();

  rejectMe().then(() => {
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

  rejectMe().then(() => {
    error('It should not be called');
  }).catch((e) => {
      error('Catched: ', e.name);
  });
}
