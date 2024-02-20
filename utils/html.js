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
  element = null;

  constructor() {         
  }

  render() {
    this.element = createElementFromHTML(this.template());
  }
    
  remove() {
    this.element?.remove();
  }
       
  destroy() {
    this.remove();
    this.element = null;
  }  
}