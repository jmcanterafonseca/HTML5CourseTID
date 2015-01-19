'use strict';

var xListProto = Object.create(HTMLElement.prototype);

// Setting the data
Object.defineProperty(xListProto, 'ref', {
  set: function(data) {
    this.clear();

    var container = this.shadowRoot.querySelector('ul');
    var template = container.
                      querySelector('content').getDistributedNodes()[1];

    data.forEach(function(aItem) {
      Templates.append(container, aItem, template);
    }, this);

    this.numItems = data.length;
  }
});

xListProto.append = function(itemData) {
  var container = this.shadowRoot.querySelector('ul');
  var template = container.
                      querySelector('content').getDistributedNodes()[1];

  Templates.append(container, itemData, template);

  this.numItems = this.numItems || 0;
  this.numItems++;
};

xListProto.item = function(indexOrId) {
  var selector;
  if (typeof indexOrId === 'string') {
    selector = '#' + indexOrId;
  }
  else {
    selector = 'li:nth-child(' + (indexOrId + 1) + ')';
  }

  return this.shadowRoot.querySelector('ul').querySelector(selector);
};

xListProto.remove = function(indexOrId) {
  var item = this.item(indexOrId);

  if (!item) {
    return;
  }

  this.shadowRoot.querySelector('ul').removeChild(item);

  this.numItems--;
};

xListProto.clear = function() {
  this.shadowRoot.querySelector('ul').innerHTML = '<content></content>';
  this.numItems = 0;
};

xListProto.createdCallback = function() {
  var shadow = this.createShadowRoot();

  var listTemplate = document.getElementById('x-list-template');
  var node = document.importNode(listTemplate.content, true);
  shadow.appendChild(node);

  var component = this;
  shadow.querySelector('ul').addEventListener('click', function(e) {
    var id = e.target.id || e.target.parentNode.id;
    component.selectedItem = id;
  });

  var link = shadow.querySelector('link');
  if (link) {
    var resource = link.href;
    var xhr = new XMLHttpRequest();

    xhr.open('GET', resource);

    xhr.onload = function() {
      shadow.innerHTML += ('<style>' + xhr.responseText + '</style>');
    }

    xhr.onerror = function() {
      alert('error');
    }

    xhr.send(null);
  }
};

var XList = document.registerElement('x-list', {
  prototype: xListProto
});
