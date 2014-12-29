function rejectMe() {
  return Promise.reject({
    name: 'RejectByDefinition'
  });
}

function executeSimpleReject() {
  clear();

  rejectMe().then(() => {
    error('It should not be called');
  }, (e) => {
      log('Rejected: ', e.name);
  });
}
