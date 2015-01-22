'use strict';

var dViewProto = Object.create(HTMLElement.prototype);

document.registerElement('d-view', {
  prototype: dViewProto,
  extends: 'section'
});


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

    var template = importedDocument.querySelector('x-body > template');

    var viewContent = document.importNode(template.content, true);

    // Now we insert the node
    component.appendChild(viewContent);
    component.isLoaded = true;

    resolve();
  });
}
