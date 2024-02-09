import {default as BaseSortableTable} from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

export default class SortableTable extends BaseSortableTable {
  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    super(headersConfig, data);

    this.sort(sorted.id, sorted.order);

    this.createListeners();
  }

  createListeners() {
    document.body.addEventListener('pointerdown', this.handleDocumentPointerdown);
  }

  destroyListeners() {
    document.body.removeEventListener('pointerover', this.handleDocumentPointerdown);
  }

  switchOrder(currentOrder) {
    if (!currentOrder) {
      return 'desc';
    }

    return currentOrder == 'asc' ? 'desc' : 'asc';
  }

  handleDocumentPointerdown = (event) => {
    const column = event.target.closest('.sortable-table__cell');
    
    if (!column) {
      return;
    }

    const columnId = column.dataset.id;
    const order = this.switchOrder(column.dataset.order);

    this.sort(columnId, order);
  }

  destroy() {
    super.destroy();
    this.destroyListeners();
  }
}
