export function createElementFromHTML(html) {
  if (html instanceof HTMLElement) {
    return html;
  }

  const tempElement = document.createElement('div');
  tempElement.innerHTML = html;
  return tempElement.firstElementChild; 
}

export function removeChildren (element) {
  while (element.firstElementChild) {
    element.firstElementChild.remove();
  }  
}

export function makeFromTemplate(template, fields) {
  let result = template;

  for (const [field, value] of Object.entries(fields)) {
    result = result.replace(field, value);           
  }

  return result;
}

export class Component {
    
  constructor() {         
    this._element = null;
  }

  get element() {
    return this._element;
  }

  render() {
    this._element = createElementFromHTML(this.template());
  }
    
  remove() {
    if (this._element) {
      this._element.remove();
    }
  }
       
  destroy() {
    this.remove();
    this._element = null;
  }    
}