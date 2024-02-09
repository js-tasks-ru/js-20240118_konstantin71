import { createElementFromHTML } from "../../utils/html.js";

const STATE_DEFAULT = 'default';
const STATE_MOVE_LEFT = 'left';
const STATE_MOVE_RIGHT = 'right';

export default class DoubleSlider {
    element = null;

    constructor({
      min = 0,
      max = 100,
      formatValue = value => value,
      selected: {
        from,
        to
      } = {}
    } = {}) {

      this.min = min;
      this.max = max;
      this._from = from ?? min;
      this._to = to ?? max;
      this._formatValue = formatValue;

      this.subElements = {};
      this._state = STATE_DEFAULT;

      this.createListeners();
      this.render();
    }
  
    createListeners() {
      document.addEventListener('pointerdown', this.handleDocumentPointerdown);
      document.addEventListener('pointermove', this.handleDocumentPointermove);
      document.addEventListener('pointerup', this.handleDocumentPointerup);
    }
  
    destroyListeners() {
      document.removeEventListener('pointerdown', this.handleDocumentPointerdown);
      document.removeEventListener('pointermove', this.handleDocumentPointermove);
      document.removeEventListener('pointerup', this.handleDocumentPointerup);
    }
  
    handleDocumentPointerdown = (event) => {
      if (event.target == this.subElements.left) {
        this._state = STATE_MOVE_LEFT;
        return;
      } 
        
      if (event.target == this.subElements.right) {
        this._state = STATE_MOVE_RIGHT;
        return;            
      }
    }

    handleDocumentPointerup = (event) => {
      this._state = STATE_DEFAULT;
    }

    handleDocumentPointermove = (event) => {

      const {left: leftBorder, right: rightBorder, width} = this.subElements.inner.getBoundingClientRect();
      const {right: leftSlider} = this.subElements.left.getBoundingClientRect();
      const {left: rightSlider} = this.subElements.right.getBoundingClientRect();

      console.log(leftSlider, rightSlider, leftBorder, rightBorder);
      console.log(this._from, this._to);
      console.log(this._from, this._to);
      console.log('left', this.subElements.left.getBoundingClientRect());
      console.log('right', this.subElements.right.getBoundingClientRect());
      console.log('inner', this.subElements.inner.getBoundingClientRect());

      if (this._state == STATE_MOVE_LEFT) {
        let clientX = event.clientX;

        clientX = Math.max(leftBorder, clientX);
        clientX = Math.min(rightSlider, clientX);

        const proc = (clientX - leftBorder) / width * 100;
            
        this.updateValueFrom(proc);
        return;
      }
    
      if (this._state == STATE_MOVE_RIGHT) {
        let clientX = event.clientX;

        clientX = Math.min(rightBorder, clientX);
        clientX = Math.max(leftSlider, clientX);

        const proc = (clientX - leftBorder) / width * 100;
            
        this.updateValueTo(proc);
        return;
      }
    }

    updateValueFrom(proc) {
      this._from = Math.round((this.max - this.min) * proc / 100 + this.min);
      this.subElements.from.innerHTML = this._formatValue(this._from); 

      console.log('update value', proc);
      console.log('update value', this._from);

      this.subElements.left.style.left = proc + '%';
      this.subElements.progress.style.left = proc + '%';
    }

    updateValueTo(proc) {
      console.log(proc);
      this._to = Math.round((this.max - this.min) * proc / 100 + this.min);
      this.subElements.to.innerHTML = this._formatValue(this._to);

      this.subElements.right.style.right = (100 - proc) + '%';
      this.subElements.progress.style.right = (100 - proc) + '%';
    }

    template() {
      const fromProc = (this._from - this.min) / (this.max - this.min) * 100;
      const toProc = (this._to - this.min) / (this.max - this.min) * 100;

      console.log('template', fromProc, toProc);

      return `
        <div class="range-slider">
            <span data-element="from">${this._formatValue(this._from)}</span>
            <div class="range-slider__inner">
                <span class="range-slider__progress" style="left: ${fromProc}%; right: ${100 - toProc}%"></span>
                <span class="range-slider__thumb-left" style="left: ${fromProc}%"></span>
                <span class="range-slider__thumb-right" style="right: ${100 - toProc}%"></span>
            </div>
            <span data-element="to">${this._formatValue(this._to)}</span>
        </div>
        `;
    }

    render() {
      this.element = createElementFromHTML(this.template());   

      this.subElements.left = this.element.querySelector('.range-slider__thumb-left');   
      this.subElements.right = this.element.querySelector('.range-slider__thumb-right');   
      this.subElements.progress = this.element.querySelector('.range-slider__progress');   
      this.subElements.inner = this.element.querySelector('.range-slider__inner');   
      this.subElements.from = this.element.querySelector('span[data-element="from"]');   
      this.subElements.to = this.element.querySelector('span[data-element="to"]');  


    }

    remove() {
        this.element?.remove();
    }

    destroy() {
      this.remove();
      this.destroyListeners();
                
    }
}


