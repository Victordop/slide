// import debounce from "./debounce.js"

export default class Slides {
    constructor(wrapper, slide) {
        this.wrapper = document.querySelector(wrapper);
        this.slide = document.querySelector(slide);
        this.dist = {
            startX: 0,
            movement: 0,
            finalPosition: 0,
        }
    }

    binding() { //mesma coisa que fazíamos antes, quando  colocamos dentro do construtor
        this.onStart = this.onStart.bind(this); //faz referência ao objeto slides
        this.onMove = this.onMove.bind(this);
        this.onEnd = this.onEnd.bind(this);
    }

    updateDistance(clientX) {
        this.dist.movement = (this.dist.startX - clientX)*1.6; //calcula movimentação (clique inicial até onde moveu o mouse); movimento *1.6 para dar o slide mais rápido
        return this.dist.finalPosition-this.dist.movement;
    }



    onStart(event) {
        event.preventDefault(); //previne aquele comportamento de aparecer a imagem quando clicamos e arrastamos
        this.dist.startX = event.clientX //pega a posição  no eixo x quando damos primeiro clique no slide
        this.wrapper.addEventListener('mousemove', this.onMove);
    }

    onEnd() {
        this.wrapper.removeEventListener('mousemove', this.onMove);
        this.dist.finalPosition=this.dist.movePosition;
    }

    onMove(event) { //ativado apenas quando fiz o mousedown primeiro
        const finalPosition = this.updateDistance(event.clientX);
        this.moveSlide(finalPosition)
    }

    moveSlide(distX) {
        this.dist.movePosition = distX; //temos uma referência do valor p começar o slide a partir dele 
        this.slide.style.transform = `translate3d(${distX}px,0,0)`
    }

    addEvent() {
        this.wrapper.addEventListener('mousedown', this.onStart); //mousedown é quando o usuário pressiona o botão do mous
        this.wrapper.addEventListener('mouseup', this.onEnd)
    }

    init() {
        this.binding();
        this.addEvent();
        return this;
    }


};