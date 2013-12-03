var MyContactsModule= (function() {
  function list() {
    var nodeList = document.getElementById('contacts-list');

    var req = navigator.mozContacts.find({});
    req.onsuccess = function() {
      var contacts = req.result;
      contacts.forEach(function(aContact) {
        var contactNode = buildContactNode(aContact);
        nodeList.appendChild(contactNode);
      });
    }

    req.onerror = function() {
      alert('There has been an error: ' + req.error.name);
    }
  }

  function buildContactNode(aContact) {
    var liNode = document.createElement('li');
    var aNode = document.createElement('a');

    liNode.appendChild(aNode);

    var pNode = document.createElement('p');
    pNode.innerHTML = aContact.givenName[0] + ' <strong>' +
    aContact.familyName[0] + '</strong>';
    aNode.appendChild(pNode);

    if (Array.isArray(aContact.org) && aContact.org[0]) {
      var orgNode = document.createElement('p');
      orgNode.textContent = aContact.org[0];
      aNode.appendChild(orgNode);
    }

    return liNode;
  }

  return {
    'list': list
  }
})();

MyContactsModule.list();
