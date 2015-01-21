'use strict';

var dViewProto = Object.create(HTMLElement.prototype);

document.registerElement('d-view', {
  prototype: dViewProto,
  extends: 'section'
});


// Loads the corresponding view identified by id
dViewProto.load = function() {
  return new Promise(function(resolve, reject) {
    // Only load one time
    if (this.isLoaded === true) {
      return Promise.resolve(targetElement.firstChildElement);
    }

    // First it is needed to get the corresponding HTML Import
    var importId = 'import' + '-' + this.id;

    var link = document.getElementById(importId);
    var importedDocument = link.import;

    var template = importedDocument.firstChildElement;

    var viewContent = document.importNode(template.content, true);

    // Now we insert the node
    this.appendChild(viewContent);
    this.isLoaded = true;

    return Promise.resolve(viewContent);
  });
}
