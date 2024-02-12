import fetchJson from './utils/fetch-json.js';


const BACKEND_URL = 'https://course-js.javascript.ru';

// https://course-js.javascript.ru/api/dashboard/orders?from=2024-01-13T15:24:35.313Z&to=2024-02-12T15:24:35.313Z

export default class ColumnChart {
  constructor({
    url = '',
    label = '', 
    value = 200,
    link = '#',
    formatHeading = v => v
  } = {}) {

    this.data = null;
    this.chartHeight = 50;

    this._label = label;
    this._value = value;
    this._formatHeading = formatHeading;
    this._link = link;
    this._url = url;

    this.subElements = {};
    this.element = null;

    this.render();  
  }

  async update(from, to) {
    const url = new URL(BACKEND_URL + '/' + this._url);
    url.searchParams.set('from', from);
    url.searchParams.set('to', to);

    const response = await fetch(url.href);
    const data = await response.json();
        
    this._update(Object.values(data));

    return data;
  }
  
  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  render() {
    this.element = UtilsHTML.createHTMLElement(this.template());
    this.selectSubElements();
  }
  
  remove() {
      this.element?.remove();
  }
  
  destroy() {
    this.remove();
    this.element = null;
  }
  
  getHeadingContent() {
    return this._formatHeading(this._value);
  }
    
  template() {
    return `
      <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
        ${this._label}
        <a href="${this._link}" class="column-chart__link">View all</a>
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${this.getHeadingContent()}</div>
          <div data-element="body" class="column-chart__chart">
            
          </div>
        </div>
      </div>
      `;
  
  }
  
  _update(data) {
    const chart = this.element.querySelector('.column-chart__chart');
  
    UtilsHTML.removeChildren(chart);
  
    for (const item of getColumnProps(data, this.chartHeight)) {
      const tempElement = document.createElement('div');
          
      tempElement.style = `--value: ${item.value}`;
      tempElement.dataset.tooltip = item.percent;
  
      chart.append(tempElement);
    }

    if (data.length > 0) {
      this.element.classList.remove('column-chart_loading');
    } else {
      this.element.classList.add('column-chart_loading');
    }
  }

}
  
function getColumnProps(data, chartHeight) {
  const maxValue = Math.max(...data);
  const scale = chartHeight / maxValue;
    
  return data.map(item => {
    return {
      percent: (item / maxValue * 100).toFixed(0) + '%',
      value: String(Math.floor(item * scale))
    };
  });
}
  
class UtilsHTML {
  static createHTMLElement(html) {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    return tempElement.firstElementChild; 
  }
  
  static removeChildren (element) {
    while (element.firstElementChild) {
      element.firstElementChild.remove();
    }
  
  }
}
  
  
  