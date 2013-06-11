var out;

function setValue() {
  alert('here we are');
  out = document.getElementById('result2');
  if(out) {
    out.value = 'The script has been loaded';
  }
}

setValue();

if(!out) {
  window.addEventListener('DOMContentLoaded', function handler() {
    window.removeEventListener('DOMContentLoaded', handler);
    setValue();
  });
}
