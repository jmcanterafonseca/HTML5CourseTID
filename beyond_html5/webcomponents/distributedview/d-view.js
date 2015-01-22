'use strict';

var dViewProto = Object.create(HTMLElement.prototype);

document.registerElement('d-view', {
  prototype: dViewProto,
  extends: 'section'
});

dViewProto._scriptLoaded = function(resolve, e) {
  console.log('Script loaded: ', e.target.src);

  this._numScriptsLoaded++;
  if (this._numScriptsLoaded === this._numScripts) {
    resolve();
  }
}

// Loads the corresponding view identified by id
dViewProto.load = function() {
  var component = this;

  return new Promise(function(resolve, reject) {
    // Only load one time
    if (component.isLoaded === true) {
      resolve();
      return;
    }

    // First it is needed to get the corresponding HTML Import
    var importId = 'import' + '-' + component.id;

    var link = document.getElementById(importId);
    var importedDocument = link.import;

    var bodyTemplate = importedDocument.querySelector('x-body > template');
    var viewContent = document.importNode(bodyTemplate.content, true);
    // Now we insert the node
    component.appendChild(viewContent);

    var headTemplate = importedDocument.querySelector('x-head > template');
    var headContent = document.importNode(headTemplate.content, true);

    var scriptLoaded = component._scriptLoaded.bind(component, resolve);
    var scripts = headContent.querySelectorAll('script');
    component._numScriptsLoaded = 0;
    component._numScripts = scripts.length;

    for(var j = 0; j < scripts.length; j++) {
      scripts.item(j).addEventListener('load', scriptLoaded);
    }

    document.head.appendChild(headContent);

    component.isLoaded = true;

    if (scripts.length === 0) {
      resolve();
    }
  });
}
