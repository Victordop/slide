import debounce from "./debounce.js"

export class Slides {
    constructor(wrapper, slide) {
        this.wrapper = document.querySelector(wrapper);
        this.slide = document.querySelector(slide);
        this.dist = {
            startX: 0,
            movement: 0,
            finalPosition: 0,
        }
        this.classActive = 'active';
        this.changeEvent = new Event('changeEvent'); //criando um evento novo
    }

    binding() { //mesma coisa que fazíamos antes, quando  colocamos dentro do construtor
        this.onStart = this.onStart.bind(this); //faz referência ao objeto slides
        this.onMove = this.onMove.bind(this);
        this.onEnd = this.onEnd.bind(this);
        this.onResize = debounce(this.onResize.bind(this), 200); //debounce para não ficar ativando toda hora milhares deste evento
        this.activePrevSlide = this.activePrevSlide.bind(this);
        this.activeNextSlide = this.activeNextSlide.bind(this);
    }

    //configurações do slide

    slidePosition(slide) {
        const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2 //tamanho da tela - tamanho slide / 2 partes em branco
        return -(slide.offsetLeft - margin); //capta a posição central dos slides em relação a tela, é como se eu somasse o offsetLeft (td p esquerda) + as margens
    }


    slideConfig() {
        this.slidesArray = [...this.slide.children].map((slide) => { //map retorna um array com modificações nos elementos
            const elementPosition = this.slidePosition(slide);
            return {
                slide,
                elementPosition,

            }
        });
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

        this.transition(false)

    }

    onMove(event) { //ativado apenas quando fiz o mousedown primeiro
        const pointerClick = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX; //op. ternário p ver se a função onMove usar o parâmetro para mousemove ou touchmove
        const finalPosition = this.updateDistance(pointerClick);
        this.moveSlide(finalPosition)
    }

    onEnd(event) {
        const movetype = (event.type === 'mouseup') ? 'mousemove' : 'touchmove';
        this.wrapper.removeEventListener(movetype, this.onMove);
        this.dist.finalPosition = this.dist.movePosition;
        this.transition(true);
        this.changeSlideOnEnd();
    }

    changeSlideOnEnd() {
        console.log(this.dist.movement);
        if (this.dist.movement > 120 && this.index.next !== undefined) {
            this.activeNextSlide();
        } else if (this.dist.movement < -120 && this.index.prev !== undefined) {
            this.activePrevSlide();
        } else {
            this.changeSlide(this.index.active);
        }
    }

    updateDistance(clientX) {
        this.dist.movement = (this.dist.startX - clientX) * 1.6; //calcula movimentação (clique inicial até onde moveu o mouse); movimento *1.6 para dar o slide mais rápido
        return this.dist.finalPosition - this.dist.movement;
    }


    moveSlide(distX) {
        this.dist.movePosition = distX; //temos uma referência do valor p começar o slide a partir dele 
        this.slide.style.transform = `translate3d(${distX}px,0,0)`
    }

    changeSlide(index) {
        const activeSlide = this.slidesArray[index];
        this.moveSlide(activeSlide.elementPosition);
        this.dist.finalPosition = activeSlide.elementPosition; //consigo navegar a partir do último que coloquei
        this.slideIndexNav(index);
        this.changeActiveClass();
        this.wrapper.dispatchEvent(this.changeEvent)//o wrapper emiti para gente o evento que criamos
     
    }

    slideIndexNav(index) {
        const ultimo = this.slidesArray.length - 1;
        return this.index = {
            prev: (index) ? index - 1 : undefined, //se for igual a 0, falsy, logo null
            active: index,
            next: (index >= ultimo) ? undefined : index + 1,
        }
    }

    addEvent() {
        this.wrapper.addEventListener('mousedown', this.onStart); //mousedown é quando o usuário pressiona o botão do mous
        this.wrapper.addEventListener('touchstart', this.onStart); //touch p/ dar responsividade, utilizado no mobile
        this.wrapper.addEventListener('mouseup', this.onEnd);
        this.wrapper.addEventListener('touchend', this.onEnd);
    }

    activePrevSlide() {
        if (this.index.prev !== undefined){
            this.changeSlide(this.index.prev);
        } 
    }

    activeNextSlide() {
        if (this.index.next !== undefined){
            this.changeSlide(this.index.next);
        } 
    }

    transition(active) {
        this.slide.style.transition = active ? 'transform .3s' : '';
    }

    changeActiveClass() {
        this.slidesArray.forEach(item => item.slide.classList.remove(this.classActive));
        this.slidesArray[this.index.active].slide.classList.add(this.classActive);

    }

    onResize() {
        setTimeout(() => { //espera carregar para dar o resize, ficam as imagens alinhadas
            this.slideConfig();
            this.changeSlide(this.index.active);
        }, 1000);
        console.log('ativou resize');
    }

    addEventOnResize() {
        window.addEventListener('resize', this.onResize);
    }

    init() {
        this.binding();
        this.transition(true);
        this.addEvent();
        this.slideConfig();
        this.addEventOnResize();
        return this;
    }


};

export default class SlideNav extends Slides { //quando extendemos classes, o construtor é o mesmo
    constructor(wrapper, slide){
        super (wrapper, slide); //tem que usar o super pois é um construtor de classe estendida
            this.controlBinding();
            this.addActiveClass=this.addActiveClass.bind(this);

    }
    addArrow(prev, next) {
        this.prevBtn = document.querySelector(prev);
        this.nextBtn = document.querySelector(next);
        this.addEventArrow();
    }

    addEventArrow() {
        this.prevBtn.addEventListener('click', this.activePrevSlide);
        this.nextBtn.addEventListener('click', this.activeNextSlide);
    }

    createControl() {
        const controle = document.createElement('ul');
        controle.dataset.control = 'slide'; //podemos estilizar usando esta marcação
        this.slidesArray.forEach((item, index) => {
            controle.innerHTML += `<li><a href="#slide${index+1}">${index+1}</a></li>`
        })
        this.wrapper.appendChild(controle);
        return controle;
    }

    addControl(customControl) {
        this.control = document.querySelector(customControl) || this.createControl();
        this.controlArray = [...this.control.children];//desestruturei e tenho um array com cada li
        this.controlArray.forEach(this.eventControl); //como o callback do foreach e da função são o mesmo, n preciso passar
        this.addActiveClass();
    }


    eventControl(item, index) {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            this.changeSlide(index);
            
        })
        this.wrapper.addEventListener('changeEvent',this.addActiveClass); //toda vez que muda o slide, muda a bolinha 
    }


    controlBinding() {
        this.eventControl = this.eventControl.bind(this); //pois estava fazendo referencia a cada elemento do array
    }

    addActiveClass(){
        this.controlArray.forEach(item=>{ item.classList.remove(this.classActive);

        });
        this.controlArray[this.index.active].classList.add(this.classActive);
    }

}



//nesta aula vamos fazer a funcionalidade para mobile, já que não funciona mousedown para ela