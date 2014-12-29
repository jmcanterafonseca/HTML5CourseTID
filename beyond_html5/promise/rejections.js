function rejectedPromise() {
  return Promise.reject({
    name: 'RejectByDefinition'
  });
}

function executeSimpleReject() {
  rejectedPromise.then(() => {
    error('It should not be called');
  }, (e) => {
      log('Rejected: ', e.name);
  });
}
