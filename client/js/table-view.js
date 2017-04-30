const { getLetterRange, getRange, getSum } = require('./array-util');
const { removeChildren, createTR, createTD, createTH } = require('./dom-util');

class TableView{
	constructor(model) {
		this.model = model;
	}

	init() {
		this.initDomReferences();
		this.initCurrentCell();
		this.renderTable();
		this.attachEventHandlers();
	}

	initDomReferences(){
		this.headerRowEl = document.querySelector('THEAD TR');
		this.sheetBodyEl = document.querySelector('TBODY');
		this.formulaBarEl = document.querySelector('#formula-bar')
		this.footerRowEl = document.querySelector('TFOOT TR')
	}

	initCurrentCell() {
		this.currentCellLocation = { col: 0, row: 0}
		this.renderFormulaBar();
	}

	normalizeValueForRendering(value) {
		return value || '';
	}

	renderFormulaBar() {
		const currentCellValue = this.model.getValue(this.currentCellLocation);
		this.formulaBarEl.value = this.normalizeValueForRendering(currentCellValue);
		this.formulaBarEl.focus();
	}

	renderTable(){
		this.renderTableHeader();
		this.renderTableBody();
		this.renderTableFooter();
	}

	renderTableHeader() {
		removeChildren(this.headerRowEl);
		getLetterRange('A', this.model.numCols)
			.map(colLabel => createTH(colLabel))
			.forEach(th => this.headerRowEl.appendChild(th));
	}

	isCurrentCell(col, row) {
		return this.currentCellLocation.col === col 
				&&
			   this.currentCellLocation.row === row ;
	}

	isCurrentColumn(col) {
		return this.currentCellLocation.col === col
	}

	renderTableBody(){
		const fragment = document.createDocumentFragment();

		for (let row = 0; row < this.model.numRows; row++) {
			const tr = createTR();

			for (let col = 0; col < this.model.numCols; col++) {
				const position = {col: col, row: row};
				const value = this.model.getValue(position);
				const td = createTD(value);


				if (this.isCurrentCell(col, row)) {
					td.className = 'current-cell';
				}

				tr.appendChild(td);
			}
			fragment.appendChild(tr);
		}

		removeChildren(this.sheetBodyEl);
		this.sheetBodyEl.appendChild(fragment);
	}

	renderTableFooter() {	
		const fragment = document.createDocumentFragment();	
		
		for (let col = 0; col < this.model.numCols; col++) {
			let nums = []
			for (let row = 0; row < this.model.numRows; row++) {
				const position = {col: col, row: row};
				const value = parseInt(this.model.getValue(position));
				if (!isNaN(value)) {
					nums.push(value);
				}
			}
			fragment.appendChild(createTD(getSum(nums)))
		}

		removeChildren(this.footerRowEl);
		this.footerRowEl.appendChild(fragment)

	}


	attachEventHandlers() { 
		this.sheetBodyEl.addEventListener('click', this.handleSheetClick.bind(this));
		this.formulaBarEl.addEventListener('keyup', this.handleFormulaBarChange.bind(this));
	}



	handleFormulaBarChange(evt) {
		const value = this.formulaBarEl.value;
		this.model.setValue(this.currentCellLocation, value);
		this.renderTableBody();
		this.renderTableFooter();
	}

	handleSheetClick(evt) {
		const col = evt.target.cellIndex;
		const row = evt.target.parentElement.rowIndex - 1;

		this.currentCellLocation = { col: col, row: row };
		this.renderTableBody();
		this.renderFormulaBar();
	}
}

module.exports = TableView;