import { createElementFromHTML } from "../../utils/html.js";

class Tooltip {
  static _instance;

  constructor() {
    if (Tooltip._instance) {
      return Tooltip._instance; 
    }

    Tooltip._instance = this;

    this._isShow = false;
  }

  createListeners() {
    document.body.addEventListener('pointerover', this.handleDocumentPointerover);
    document.body.addEventListener('pointerout', this.handleDocumentPointerout);
    document.body.addEventListener('mousemove', this.handleDocumentMousemove);
  }

  destroyListeners() {
    document.body.removeEventListener('pointerover', this.handleDocumentPointerover);
    document.body.removeEventListener('pointerout', this.handleDocumentPointerout);
    document.body.removeEventListener('mousemove', this.handleDocumentMousemove);
  }

  handleDocumentPointerover = (event) => {
    const currentElement = event.target;
    const tooltip = currentElement.dataset.tooltip;

    if (!tooltip) {
      return;
    }

    this.render(tooltip);

    this.updateTooltipPosition(event.clientX, event.clientY);

    this._isShow = true;
  }

  handleDocumentPointerout = () => {
    if (this._isShow) {
      this.remove();
      this._isShow = false;  
    }
  }

  handleDocumentMousemove = (event) => {
    if (this._isShow) {
      this.updateTooltipPosition(event.pageX, event.pageY); 
    }
  }

  updateTooltipPosition(x, y) {
    this.element.style.left = x + 15 + 'px';
    this.element.style.top = y + 15 + 'px';
  }


  initialize () {
    this.destroyListeners();
    this.createListeners();
  }
  
  template(tooltip) {
    return `<div class="tooltip">${tooltip}</div>`;
  }

  render(tooltip) {
    this.remove();
    this.element = createElementFromHTML(this.template(tooltip));

    document.body.append(this.element);
  }

  remove() {
    this.element?.remove();
  }

  destroy() {
    this.remove();
    this.destroyListeners();
  }


}

export default Tooltip;
