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

    //configurações do slide

    slidePosition(slide){
        const margin = (this.wrapper.offsetWidth - slide.offsetWidth)/2 //tamanho da tela - tamanho slide / 2 partes em branco
        return -(slide.offsetLeft - margin); //capta a posição central dos slides em relação a tela, é como se eu somasse o offsetLeft (td p esquerda) + as margens
    }


    slideConfig(){
        this.slidesArray = [...this.slide.children].map((slide)=>{ //map retorna um array com modificações nos elementos
            const elementPosition = this.slidePosition(slide);
            return {
                slide,
                elementPosition,

            }
        });
        console.log(this.slidesArray);
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
        this.changeSlideOnEnd();
    }

    changeSlideOnEnd(){
        console.log(this.dist.movement);
        if(this.dist.movement>120){
            this.activeNextSlide();
        }else if(this.dist.movement<-120){
            this.activePrevSlide();
        }else{
            this.changeSlide(this.index.active);
        }
    }

    updateDistance(clientX) {
        this.dist.movement = (this.dist.startX - clientX) * 1.6; //calcula movimentação (clique inicial até onde moveu o mouse); movimento *1.6 para dar o slide mais rápido
        return this.dist.finalPosition - this.dist.movement;
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

    changeSlide(index){
        const activeSlide = this.slidesArray[index];
       this.moveSlide(activeSlide.elementPosition);
       this.dist.finalPosition= activeSlide.elementPosition; //consigo navegar a partir do último que coloquei
       this.slideIndexNav(index);
    }

    slideIndexNav(index){
        const ultimo = this.slidesArray.length-1;
        return this.index={
            prev:(index)?index-1:undefined, //se for igual a 0, falsy, logo null
            active:index,
            next:(index>=ultimo)?undefined:index+1,
        }
    }

    addEvent() {
        this.wrapper.addEventListener('mousedown', this.onStart); //mousedown é quando o usuário pressiona o botão do mous
        this.wrapper.addEventListener('touchstart', this.onStart); //touch p/ dar responsividade, utilizado no mobile
        this.wrapper.addEventListener('mouseup', this.onEnd);
        this.wrapper.addEventListener('touchend', this.onEnd);
    }

    activePrevSlide(){
        if(this.index.prev !== undefined) this.changeSlide(this.index.prev);
    }

    activeNextSlide(){
        if(this.index.next !== undefined) this.changeSlide(this.index.next);
    }

    init() {
        this.binding();
        this.addEvent();
        this.slideConfig();
        return this;
    }


};

//nesta aula vamos fazer a funcionalidade para mobile, já que não funciona mousedown para ela