'use strict';

function loadView1() {
  document.getElementById('notes-list-view').load().then((node) => {
    node.querySelector('[data-type="list"] header').textContent = 'This is my list!';
  });
}

function loadView2() {
  document.getElementById('notes-form-view').load();
}
