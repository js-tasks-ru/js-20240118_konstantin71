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
    
    this.render();
    this._update();    
  }

  render() {
    this._element = UtilsHTML.createHTMLElement(this.template());
    document.body.append(this._element);
  }

  remove() {
    this._element.remove();
  }

  destroy() {
    this.remove();
    this._element = null;
  }

  getHeadingContent() {
    return this._formatHeading(this._value);
  }
  
  template() {
    return `
    <div class="column-chart ${this._data.length > 0 ? '' : 'column-chart_loading'}" style="--chart-height: 50">
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
  }

  _update() {
    const chart = this._element.querySelector('.column-chart__chart');

    UtilsHTML.removeChildren(chart);



    for (const item of getColumnProps(this._data, this.chartHeight)) {
      const tempElement = document.createElement('div');
        
      tempElement.style = `--value: ${item.value}`;
      tempElement.dataset.tooltip = item.percent;

      chart.append(tempElement);
    }
  }


  get element() {
    return this._element;
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


