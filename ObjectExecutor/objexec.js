'use strict';

function ObjectExecutor(items, db) {
  var CHUNK_SIZE = 5;
  var self = this;
  var myItems = items;
  var transaction;
  var next = 0;
  var numResponses = 0;


  function doTheWork() {
    transaction = db.transaction('theStore', 'readwrite');
    var store = transaction.objectStore('theStore');
    var start = next;
    for(var j = start; j < start + CHUNK_SIZE; j++) {
      var req = store.put(myItems[next++]);
      req.onsuccess = onRecordAdded;
      req.onerror = onRecordError;
    }
  }

  function onRecordAdded() {
    numResponses++;
    if(typeof self.onrecordadded === 'function') {
      window.setTimeout(self.onrecordadded);
    }
    continueCb();
  }

  function continueCb() {
    if(numResponses === CHUNK_SIZE && next < myItems.length) {
      numResponses = 0;
      doTheWork();
    }
    else if(next === myItems.length) {
      if(typeof self.onfinish === 'function') {
        window.setTimeout(self.onfinish);
      }
    }
  }

  function onRecordError() {
    if(typeof self.onerror == 'function') {
      window.setTimeout(self.onerror);
    }
    continueCb();
  }

  this.start = function() {
    doTheWork();
  }

  this.hold = function() {
    // TODO: Implement me
  }

  this.finish  = function() {
    // TODO: Implement me
  }

  this.resume = function() {
    // TODO: Implement me
  }
}


