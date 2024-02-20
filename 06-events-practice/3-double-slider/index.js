import { createElementFromHTML } from "../../utils/html.js";

const STATE_DEFAULT = 'default';
const STATE_MOVE_LEFT = 'left';
const STATE_MOVE_RIGHT = 'right';




export default class DoubleSlider {
    element = null;
    subElements = {};

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

      this._state = STATE_DEFAULT;
      this._clickPosX = null;

      this.createListeners();
      this.render();
    }
  
    selectSubElements() {
      this.element.querySelectorAll('[data-element]').forEach(element => {
        this.subElements[element.dataset.element] = element;
      });
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
        
        this.sliderRect = this.subElements.slider.getBoundingClientRect();
         
        return;
      } 
        
      if (event.target == this.subElements.right) {
        this._state = STATE_MOVE_RIGHT;

        this.sliderRect = this.subElements.slider.getBoundingClientRect();
        
        return;            
      }
    }

    get selected() {
      return {
        from: this._from,
        to: this._to
      };
    }

    handleDocumentPointerup = (event) => {
      this._state = STATE_DEFAULT;

      const rangeSelect = new CustomEvent("range-select", 
        { bubbles: true, detail: this.selected }); 
      
      this.element.dispatchEvent(rangeSelect);
    }

    handleDocumentPointermove = (event) => {
      if (this._state == STATE_MOVE_LEFT) {
        
        const clickX = event.clientX;
        const sliderLeftX = this.sliderRect.left;
        const sliderRightX = this.sliderRect.left + this.sliderRect.width;
        
        const normalizeClickX = Math.max(sliderLeftX, Math.min(sliderRightX, clickX));
        const clickSliderX = normalizeClickX - sliderLeftX;
        const percentClickX = Math.round(clickSliderX / this.sliderRect.width * 100);

        const toProc = (this._to - this.min) / (this.max - this.min) * 100;
        const normalizePercentClickX = Math.min(percentClickX, toProc);
            
        this.updateValueFrom(normalizePercentClickX);
        return;
      }
    
      if (this._state == STATE_MOVE_RIGHT) {
        const clickX = event.clientX;
        const sliderLeftX = this.sliderRect.left;
        const sliderRightX = this.sliderRect.left + this.sliderRect.width;
        
        const normalizeClickX = Math.max(sliderLeftX, Math.min(sliderRightX, clickX));
        const clickSliderX = normalizeClickX - sliderLeftX;
        const percentClickX = Math.round(clickSliderX / this.sliderRect.width * 100);
        
        const fromProc = (this._from - this.min) / (this.max - this.min) * 100;
        const normalizePercentClickX = Math.max(percentClickX, fromProc);

        this.updateValueTo(normalizePercentClickX);
        return;
      }
    }

    updateValueFrom(proc) {
      this._from = Math.round((this.max - this.min) * proc / 100 + this.min);
      this.subElements.from.innerHTML = this._formatValue(this._from); 

      this.subElements.left.style.left = proc + '%';
      this.subElements.progress.style.left = proc + '%';
    }

    updateValueTo(proc) {
      this._to = Math.round((this.max - this.min) * proc / 100 + this.min);
      this.subElements.to.innerHTML = this._formatValue(this._to);

      this.subElements.right.style.right = (100 - proc) + '%';
      this.subElements.progress.style.right = (100 - proc) + '%';
    }

    template() {
      const fromProc = (this._from - this.min) / (this.max - this.min) * 100;
      const toProc = (this._to - this.min) / (this.max - this.min) * 100;

      return `
        <div class="range-slider">
            <span data-element="from">${this._formatValue(this._from)}</span>
            <div data-element="slider" class="range-slider__inner">
                <span data-element="progress" class="range-slider__progress" style="left: ${fromProc}%; right: ${100 - toProc}%"></span>
                <span data-element="left" class="range-slider__thumb-left" style="left: ${fromProc}%"></span>
                <span data-element="right" class="range-slider__thumb-right" style="right: ${100 - toProc}%"></span>
            </div>
            <span data-element="to">${this._formatValue(this._to)}</span>
        </div>
        `;
    }

    render() {
      this.element = createElementFromHTML(this.template());
      this.selectSubElements();
    }

    remove() {
        this.element?.remove();
    }

    destroy() {
      this.remove();
      this.destroyListeners();
                
    }
}


