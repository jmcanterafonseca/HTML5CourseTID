'use strict';

function loadView1() {
  document.getElementById('notes-list-view').load().then((node) => {
    var dataList = [
      {
        id: 'l1',
        text: 'Text of element 1'
      },
      {
        id: 'l2',
        text: 'Text of element 2'
      }
    ];
    node.querySelector('x-list').ref = dataList;
  });
}

function loadView2() {
  document.getElementById('notes-form-view').load();
}
