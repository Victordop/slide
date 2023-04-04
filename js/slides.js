// import debounce from "./debounce.js"

export default class Slides{
constructor(wrapper,slide){
this.wrapper=document.querySelector(wrapper);
this.slide=document.querySelector(slide);
}

binding(){ //mesma coisa que fazíamos antes, quando  colocamos dentro do construtor
this.onStart=this.onStart.bind(this); //faz referência ao objeto slides
this.onMove=this.onMove.bind(this);
this.onEnd=this.onEnd.bind(this);
}

onStart(event){
event.preventDefault(); //previne aquele comportamento de aparecer a imagem quando clicamos e arrastamos
console.log('mousedown');
this.wrapper.addEventListener('mousemove',this.onMove);
}

onEnd(){
    console.log('end');
    this.wrapper.removeEventListener('mousemove',this.onMove);
}

onMove(){ //ativado apenas quando fiz o mousedown primeiro
console.log('mousemove')
}

addEvent(){
this.wrapper.addEventListener('mousedown',this.onStart); //mousedown é quando o usuário pressiona o botão do mous
this.wrapper.addEventListener('mouseup',this.onEnd)
}

init(){
    this.binding();
    this.addEvent();
    return this;
}


};