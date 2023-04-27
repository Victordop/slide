import Slides from "./slides.js";


const slides = new Slides('.wrapper','.slide');
slides.init();
slides.changeSlide(0);
// slides.activeNextSlide();