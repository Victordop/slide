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
        this.dist.movement = (this.dist.startX - clientX) * 1.6; //calcula movimentação (clique inicial até onde moveu o mouse); movimento *1.6 para dar o slide mais rápido
        return this.dist.finalPosition - this.dist.movement;
    }


    onStart(event) {
        let movetype;

        if (event.type === 'mousedown') {
            event.preventDefault(); //previne aquele comportamento de aparecer a imagem quando clicamos e arrastamos
            this.dist.startX = event.clientX //pega a posição  no eixo x quando damos primeiro clique no slide
            movetype = 'mousemove';
        } else {
            this.dist.startX = event.changedTouches[0].clientX; //é o primeiro toque no mobile, equivale a event.clientX
            movetype = 'touchmove';

        }


        this.wrapper.addEventListener(movetype, this.onMove);

    }

    onEnd(event) {
        const movetype = (event.type==='mouseup')?'mousemove':'touchmove';
        this.wrapper.removeEventListener(movetype, this.onMove);
        this.dist.finalPosition = this.dist.movePosition;

    }

    onMove(event) { //ativado apenas quando fiz o mousedown primeiro
        const pointerClick = (event.type==='mousemove')?event.clientX:event.changedTouches[0].clientX;//op. ternário p ver se a função onMove usar o parâmetro para mousemove ou touchmove
        const finalPosition = this.updateDistance(pointerClick);
        this.moveSlide(finalPosition)
    }

    moveSlide(distX) {
        this.dist.movePosition = distX; //temos uma referência do valor p começar o slide a partir dele 
        this.slide.style.transform = `translate3d(${distX}px,0,0)`
    }

    addEvent() {
        this.wrapper.addEventListener('mousedown', this.onStart); //mousedown é quando o usuário pressiona o botão do mous
        this.wrapper.addEventListener('touchstart', this.onStart); //touch p/ dar responsividade, utilizado no mobile
        this.wrapper.addEventListener('mouseup', this.onEnd);
        this.wrapper.addEventListener('touchend', this.onEnd)
    }

    init() {
        this.binding();
        this.addEvent();
        return this;
    }


};

//nesta aula vamos fazer a funcionalidade para mobile, já que não funciona mousedown para ela