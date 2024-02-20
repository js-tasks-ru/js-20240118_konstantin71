import fetchJson from './utils/fetch-json.js';

import BaseColumnChart from "../../04-oop-basic-intro-to-dom/1-column-chart/index.js";

const BACKEND_URL = 'https://course-js.javascript.ru';

// https://course-js.javascript.ru/api/dashboard/orders?from=2024-01-13T15:24:35.313Z&to=2024-02-12T15:24:35.313Z

export default class ColumnChart extends BaseColumnChart {
  constructor({
    url = '',
    label = '',
    data = [],
    value = 200,
    link = '#',
    formatHeading = v => v
  } = {}) {
    super({url, label, data, value, link, formatHeading});

    this._url = url;
  }

  async update(from, to) {
    const url = new URL(BACKEND_URL + '/' + this._url);
    url.searchParams.set('from', from);
    url.searchParams.set('to', to);

    const response = await fetch(url.href);
    const data = await response.json();

    this._data = Object.values(data);
    this._update();

    return data;
  }
  
}
  
  