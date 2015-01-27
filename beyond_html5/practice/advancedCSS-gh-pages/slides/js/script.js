'use strict';


var slides = document.querySelectorAll('.slide');

for (var i = 0; i < slides.length; i++) {
  var slide = slides[i];
  var nextBtn = slide.querySelector('.next');
  var prevBtn = slide.querySelector('.prev');
  if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide.bind(null, i), false);
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide.bind(null, i), false);
  }
}

function nextSlide(i) {
  document.querySelectorAll('.slide')[i+1].classList.add('show');
  document.body.dataset.slide = i + 2;
}

function prevSlide(i) {
  document.querySelectorAll('.slide')[i].classList.remove('show');
  document.body.dataset.slide = i;
}

// Avoid loosing focus on tab in contenteditable box
// Move slides with keyboard
document.onkeydown = function(e) {
  //console.log(e.keyCode);
  //console.log(e.target.nodeName);
  if (e.keyCode === 9){
    e.preventDefault();
  }
  if (e.target.nodeName != 'STYLE') {
    if (e.keyCode === 39) {
      e.preventDefault();
      nextSlide(currentSlide());
    }
    if(e.keyCode === 37){
      e.preventDefault();
      prevSlide(currentSlide());
    }
  }
}

function currentSlide() {
  return document.body.dataset.slide - 1;
}