if(window.mozIndexedDB) {
    window.indexedDB = window.mozIndexedDB;
}

if(window.webkitIndexedDB) {
   window.indexedDB = window.webkitIndexedDB;
}

var database;
var objStore;
var STORE_NAME = 'customers3';

var objs = [
            {dni: '12897654M', name: 'José', surname: 'Cantera', age:35},
            {dni: '07897654M', name: 'Carlos', surname: 'Gonzalez', age: 44},
            {dni: '98765432J', name: 'Manuel', surname: 'Alvarez', age: 27},
            {dni: '67543211H', name: 'Manuel', surname: 'Zapatero', age: 66}
            ];

function createDB() {
    if(window.indexedDB) {
        write("Indexed DB is here");
        var request = indexedDB.open("MyDatabase", "DatabaseDescription");
        request.onsuccess = function(event) {
            database = this.result;
            write("Database Opened", database);
        };
        request.onerror = function(e) {
            writeError(e);
        };
    }
    else {
            write("Indexed DB is not available. It is time you update your browser!!!");
    }
}

function createObjStore() {
   if(!database.objectStoreNames.contains(STORE_NAME)) {
      var dbr = database.setVersion("2.0");
      dbr.onerror = function(event) {  
         writeError("Error while setting DB version" + this.error);  
      };  
      dbr.onsuccess = function(event) {  
         // Create an objectStore to hold information about our customers. We're  
         // going to use "dni" as our key path because it's guaranteed to be unique.  
         objectStore = database.createObjectStore(STORE_NAME, { keyPath: "dni" });
         objectStore.createIndex('byName','name',{ unique: false });
         write('Object Store Created',objectStore);
      }
   }
   else {
      write('Object Store already exists');
   }
}

function deleteObjects() {
   
   write("Before Delete");
   // numObjects();
   
   var trans = database.transaction([STORE_NAME],1);
   var objStr = trans.objectStore(STORE_NAME);
   
   var req = objStr.clear();
   
   req.onsuccess = function() {
      write("Storage has been cleared");
      
      write("After Delete");
      // numObjects();
   }
   
   req.onerror = function() {
      write(this.error);
   }
}

function numObjects() {
   var trans = database.transaction([STORE_NAME],1);
   var objStr = trans.objectStore(STORE_NAME);
   
   // Not supported yet by Chrome
   var req = objStr.count();
   
   req.onsuccess = function() {
      write("Num Objects: " + this.result);
   }
   
   req.onerror = function() {
      write(this.error);
   }
}

function save() {
   var trans = database.transaction([STORE_NAME],1);
   var objStr = trans.objectStore(STORE_NAME);
   for(var i=0,len = objs.length; i < len; i++) {
      window.console.log('Writing: ' + objs[i].dni);
      var dbr = objStr.put(objs[i]);
      dbr.onsuccess = function() {
         write('Object written: ' + this.result);
      }
      dbr.onerror = function() {
         writeError(this.error);
      }
   }
   
   trans.oncomplete = function(e) {
      write('Transaction is now completed: ' + e.target);
   }
}

function getData() {
   var dni = document.getElementById('cdni').value;
   
   var trans = database.transaction([STORE_NAME]);
   var objStr = trans.objectStore(STORE_NAME);
   
   var req = objStr.get(dni);
   
   req.onsuccess = function() {
      if(this.result) {
         write("dni:" + this.result.dni + " name:" + this.result.name);
      }
      else write("Not found!!!!");
   }
   
   req.onerror = function() {
      writeError(this.error);
   }
}

function doFindByName() {
   findByName(document.getElementById('cname').value);
}

function findByName(name) {
    window.console.log('Finding by name: ' + name);
    
    var trans = database.transaction([STORE_NAME]);
    var objStr = trans.objectStore(STORE_NAME);
    
    var index = objStr.index('byName');
    
    var req = index.get(name);
    
    req.onsuccess = function() {
     write(this.result.dni); 
    }
    
    req.onerror = function() {
      writeError(this.error);
    }
}

function listByName() {
   var trans = database.transaction([STORE_NAME]);
    var objStr = trans.objectStore(STORE_NAME);
    
    var index = objStr.index('byName');
    
    var req = index.openCursor();
    var cursor;
    
    req.onsuccess = function() {
      cursor = this.result;
      
      if(cursor) {
         write(cursor.value.name);
         cursor.continue();
      }
    }
    
    req.onerror = function() {
      writeError(this.error);
    }
}


function write(msg,obj) {
   var obx = obj;
   
   if(typeof(obj) == "undefined") {
      obx = '';
   }
   
   document.getElementById("msg").innerHTML += ("<br>" + msg + " : " + obx);
}
            
function writeError(e) {
    document.getElementById("error").innerHTML = e.message
}