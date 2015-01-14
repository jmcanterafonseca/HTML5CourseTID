'use strict';

function templateReplace(data) {
  return function(text, property) {
    var out = data[property];
    if (typeof out === 'undefined') {
      out = text;
    }
    return out;
  }
}

var Templates = {
  append: function(container, data) {
    var template =  container.querySelector('::content');
    // This is a document fragment
    var templateFragment = template.content;

    // We import the root element and then clone
    var newElem = document.importNode(
                templateFragment.firstElementChild, true);
    var inner = newElem.innerHTML;

    var pattern = /#(\w+[\w.]*)#/g;
    // Replace function
    var replaceFunction = templateReplace(data);
    var ninner = inner.replace(pattern, replaceFunction);

    newElem.innerHTML = ninner;

    container.appendChild(newElem);
  }
}
