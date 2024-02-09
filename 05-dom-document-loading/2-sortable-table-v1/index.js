import { makeFromTemplate, Component, createElementFromHTML, removeChildren } from "../../utils/html.js";

export default class SortableTable extends Component {
  constructor(headerConfig = [], data = []) {
    super();

    this._headerConfig = headerConfig;
    this._data = data;

    this.subElements = {
      body: null,
      header: {
        children: []
      }
    };

    this._columns = {};
    this._rows = [];

    this.render();
  }

  templateMakeHeaderCell({
    id,
    title = '',
    sortable = false
  } = {}) {
    
    const headerCell = createElementFromHTML(makeFromTemplate(
      TEMPLATE_HEADER_CELL,
      {
        '[id]': id,
        '[title]': title,
        '[sortable]': sortable,
        '[sorting_marker]': sortable ? TEMPLATE_HEADER_CELL_SORTING_MARKER : ''
      }
    ));

    this._columns[id] = headerCell;

    return headerCell;
  }

  templateMakeHeader() {
    const header = document.createElement('div');
    
    header.dataset.element = 'header';
    header.classList.add('sortable-table__header', 'sortable-table__row');

    this._columns = {};
    this.subElements.header.children = [];

    for (const headerCellConfig of this._headerConfig) {
      const newColumn = this.templateMakeHeaderCell(headerCellConfig);
      
      header.append(newColumn);
      this.subElements.header.children.push(newColumn);
    }

    return header;
  }

  templateMakeLoadingLine() {
    const loadingLine = document.createElement('div');

    loadingLine.dataset.element = 'loading';
    loadingLine.classList.add('loading-line', 'sortable-table__loading-line');

    return loadingLine;
  }

  templateMakeTableBody() {
    const tableBody = document.createElement('div');

    tableBody.dataset.element = 'body';
    tableBody.classList.add('sortable-table__body');

    this._rows = [];

    for (const rowData of this._data) {
      const row = this.templateMakeRow(rowData);
      tableBody.append(row);
      this._rows.push({
        element: row,
        value: rowData
      });
    }

    this.subElements.body = tableBody;

    return tableBody;
  }

  templateMakeRow(rowData) {
    const row = document.createElement('a');

    row.href = '';
    row.classList.add('sortable-table__row');

    for (const {id: cellId, template = this.templateMakeCell} of this._headerConfig) {
      const cell = createElementFromHTML(template(rowData[cellId]));
      row.append(cell);
    }

    return row;
  }

  templateMakeCell(cellData) {
    return `<div class="sortable-table__cell">${cellData}</div>`;
  }

  template() {
    const table = document.createElement('div');
    table.classList.add('sortable-table');

    table.append(this.templateMakeHeader());
    table.append(this.templateMakeTableBody());
    table.append(this.templateMakeLoadingLine());

    return table;
  }

  clearOrder() {
    for (const [id, value] of Object.entries(this._columns)) {
      value.dataset.order = '';
    }
  }

  sort(field, order = 'asc') {
    this.clearOrder();
    this._columns[field].dataset.order = order;

    this._rows.sort((a, b) => {
      a = a.value[field];
      b = b.value[field];

      const compareFunc = typeof a == 'string' ? stringLocalCompare : compare;

      if (order == 'asc') {
        return compareFunc(a, b);
      } else {
        return compareFunc(b, a);
      }
    });

    removeChildren(this.subElements.body);

    this._rows.forEach(
      ({element: rowElement}) => this.subElements.body.append(rowElement)
    );
  }
}

const TEMPLATE_HEADER_CELL = `
<div class="sortable-table__cell" data-id="[id]" data-sortable="[sortable]">
  <span>[title]</span>
  [sorting_marker]
</div>
`;

const TEMPLATE_HEADER_CELL_SORTING_MARKER = `
<span data-element="arrow" class="sortable-table__sort-arrow">
  <span class="sort-arrow"></span>
</span>
`;

function stringLocalCompare(a, b) {
  return a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'});
}

function compare(a, b) {
  return a - b;
}
