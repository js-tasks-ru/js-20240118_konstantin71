import fetchJson from './utils/fetch-json.js';

import { removeChildren } from "../../utils/html.js";

const BACKEND_URL = 'https://course-js.javascript.ru';

import BaseSortableTable from '../../06-events-practice/1-sortable-table-v2/index.js';

export default class SortableTable extends BaseSortableTable {
  constructor(headersConfig, {
    url = null,
    data = [],
    isSortLocally = false,
    sorted = {}
  } = {}) {

    super(headersConfig, {data, isSortLocally, sorted});

    this._url = url;

    this._downloade = this.loadingStart()
      .then(this.removeRows)
      .then(this.loadData)
      .then(_ => this.update())
      .then(this.loadingFinish);     
  }

  loadData = async () => {
    const url = new URL(BACKEND_URL + '/' + this._url);
    url.searchParams.set('_embed', 'subcategory.category');
    url.searchParams.set('_sort', this._sorted.id);
    url.searchParams.set('_order', this._sorted.order);
    url.searchParams.set('_start', 0);
    url.searchParams.set('_end', 30);

    return fetch(url.href).then(async response => {
      return await response.json();
    }).then(
      json => {
        this._data = json;
      }
    ).catch(_ => {
      this._data = [];
    });
  }
  loadingStart = async () => {
    this.subElements.table.classList.add('sortable-table_loading');
  }

  loadingFinish = async () => {
    this.subElements.table.classList.remove('sortable-table_loading');
  }

  removeRows = async () => {
    removeChildren(this.subElements.body);
  }

  async render() {
    this._downloader = await this._downloader;

    return this.loadingStart()
      .then(this.removeRows)
      .then(this.loadData)
      .then(_ => this.update())
      .then(this.loadingFinish);
  }

  async sort(id, order) {
    this._sorted.id = id;
    this._sorted.order = order;
    this.clearOrder();
    this._columns[id].dataset.order = order;

    if (this._isSortLocally) {
      return this.sortOnClient(id, order);
    } else {
      return this.sortOnServer(id, order);
    }
  }

  async sortOnClient (id, order) {
    super.sort(id, order);
  }

  async sortOnServer (id, order) {
    return this.loadingStart()
    .then(this.removeRows)
    .then(this.loadData)
    .then(_ => this.update())
    .then(this.loadingFinish);
  }
}

