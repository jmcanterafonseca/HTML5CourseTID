'use strict';

var MyContactsModule= (function() {
  var detailSection, listSection;

  function start() {
    init();
    list();
  }

  function init() {
    listSection = document.getElementById('contacts-list');
    detailSection = document.getElementById('detail');

    listSection.addEventListener('click', showDetail);

    document.getElementById('back').addEventListener('click', goBack);
  }

  function goBack() {
    detailSection.addEventListener('transitionend', function tend() {
      detailSection.removeEventListener('transitionend', tend);
      detailSection.classList.remove('right-to-left');
      detailSection.classList.remove('back-to-right');
    });

    detailSection.classList.add('back-to-right');
  }

  function list() {
    var req = navigator.mozContacts.find({});
    req.onsuccess = function() {
      var contacts = req.result;
      contacts.forEach(function(aContact) {
        var contactNode = buildContactNode(aContact);
        listSection.appendChild(contactNode);
      });
    }

    req.onerror = function() {
      alert('There has been an error: ' + req.error.name);
    }
  }

  function showDetail(e) {
    var target = e.target;
    detailSection.classList.add('right-to-left');
    var name = target.parentNode.dataset.name;
    detailSection.querySelector('h1').textContent = name;
  }

  function buildContactNode(aContact) {
    var liNode = document.createElement('li');
    liNode.dataset.name = aContact.name[0];
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
    'start': start
  }
})();
