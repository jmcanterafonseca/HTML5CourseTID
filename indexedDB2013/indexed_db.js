'use strict';

function debug(value) {
  document.getElementById('result').innerHTML += '<br>' + value;
}

var DatabaseMod = {
  _STORE_NAME: 'Employees',
  // IndexedDB API
  _database: null,

  _table: null,

  _records: [
    {
      ssn: 'A123456',
      name: 'Carlos Fullea'
    },
    {
      ssn: 'B98765',
      name: 'Luis López'
    }
  ],

  _doInit: function() {
    document.getElementById('openDB').addEventListener('click', this);
    document.getElementById('addRecords').addEventListener('click', this);
    document.getElementById('listRecords').addEventListener('click', this);

    this._table = document.querySelector('table');
  },

  _renderObj: function(obj) {
    if(obj) {
      var row = document.createElement('tr');
      var col1 = document.createElement('td');
      var col2 = document.createElement('td');
      row.appendChild(col1);
      row.appendChild(col2);

      col1.textContent = obj.ssn;
      col2.textContent = obj.name;

      this._table.appendChild(row);
    }
  },

  init: function() {
    if(document.readyState === 'interactive') {
      this._doInit();
    }
    else {
      document.addEventListener('readystatechange', function handler() {
        if(document.readyState !== 'loading') {
          window.removeEventListener('readystatechange', handler);
          this._doInit();
        }
      }.bind(this));
    }
  },

  openDB: function() {
    // Opening a Database
    var req = window.indexedDB.open('Database 6', 3.0);

    // Invoked when DB needs upgrade (or does not exist yet)
    req.onupgradeneeded = function(e) {
      window.console.log('Upgrade needed');
      this._database = e.target.result;

     this._database.createObjectStore(this._STORE_NAME, {keyPath: 'ssn'});
      window.console.log('Upgrade done');
    }.bind(this)

    req.onsuccess = function(e) {
      debug('Database opened successfully');
      this._database = e.target.result;
    }.bind(this)

    req.onerror = function(e) {
      debug('Error: ', req.error.name);
    }
  },

  addRecords: function(cbs) {
    var transaction = this._database.
                              transaction([this._STORE_NAME], 'readwrite');

    var store = transaction.objectStore(this._STORE_NAME);

    this._records.forEach(function(obj) {
      store.put(obj);
    });

    transaction.oncomplete = cbs.success;
    transaction.onerror = cbs.error;
  },

  handleEvent: function(e) {
    if(e.target.id === 'openDB') {
      this.openDB();
    }
    else if(e.target.id === 'addRecords') {
      this.addRecords({
        success: function() {
          debug('Records added successfully');
        },
        error: function() {
          debug('Error while adding records');
        }
      });
    }
    else if(e.target.id === 'listRecords') {
      this.listRecords();
    }
  },

  listRecords: function() {
    var transaction = this._database.transaction([this._STORE_NAME], 'readonly');

    var store = transaction.objectStore(this._STORE_NAME);

    var req = store.openCursor();
    
    req.onsuccess = function() {
      var cursor = req.result;
      if(cursor) {
        _renderObj(cursor.value);
        cursor.continue();
      }
    }

    req.onerror = function() {
      debug('Error in cursor: ', req.error.name);
    }
  }
}
