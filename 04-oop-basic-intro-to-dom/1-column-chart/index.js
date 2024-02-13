import { createElementFromHTML, removeChildren } from "../../utils/html.js";

export default class ColumnChart {
  constructor({
    data = [],
    label = '', 
    value = 200,
    link = '#',
    formatHeading = v => v
  } = {}) {

    this._data = data;
    this._label = label;
    this._value = value;
    this._formatHeading = formatHeading;
    this._link = link;

    this.chartHeight = 50;

    this.subElements = {};
    this.element = null;

    this.createElement();
    this._update();    
  }

  createElement() {
    this.element = createElementFromHTML(this.template());
    this.selectSubElements();
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
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
    <div class="column-chart ${this._data.length > 0 ? '' : 'column-chart_loading'}" style="--chart-height: ${this.chartHeight}">
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

  update(data) {
    this._data = data;
    this._update();

    return data;
  }

  _update() {
    const chart = this.element.querySelector('.column-chart__chart');

    removeChildren(chart);

    for (const item of this.getColumnProps(this._data, this.chartHeight)) {
      const tempElement = document.createElement('div');
        
      tempElement.style = `--value: ${item.value}`;
      tempElement.dataset.tooltip = item.percent;

      chart.append(tempElement);
    }

    if (this._data.length > 0) {
      this.element.classList.remove('column-chart_loading');
    } else {
      this.element.classList.add('column-chart_loading');
    }
  }

  getColumnProps(data, chartHeight) {
    const maxValue = Math.max(...data);
    const scale = chartHeight / maxValue;
    
    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }
}


