import SlideNav from "./slides.js";


const slides = new SlideNav('.wrapper','.slide');
slides.init();
slides.changeSlide(0);
slides.addArrow('.prev-btn','.next-btn')
slides.addControl();