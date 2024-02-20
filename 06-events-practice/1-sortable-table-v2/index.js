import BaseSortableTable from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

export default class SortableTable extends BaseSortableTable {
  constructor(headersConfig, {
    data = [],
    isSortLocally = false,
    sorted = {}
  } = {}) {
    super(headersConfig, data);

    this._sorted = sorted;
    this._isSortLocally = isSortLocally;

    //this.sort(sorted.id, sorted.order);

    this.createListeners();
  }

  createListeners() {
    this.subElements.header.header.addEventListener('pointerdown', this.handleDocumentPointerdown);
  }

  destroyListeners() {
    this.subElements.header.header.removeEventListener('pointerover', this.handleDocumentPointerdown);
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
    
    if (column.dataset.sortable == 'false') {
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
