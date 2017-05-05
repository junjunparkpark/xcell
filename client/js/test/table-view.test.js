const fs = require('fs');
const TableModel = require('../table-model');
const TableView = require('../table-view');

describe('table-view', () => {

	beforeEach(() => {

		const fixturePath = './client/js/test/fixtures/sheet-container.html';
		const html = fs.readFileSync(fixturePath, 'utf8');
		document.documentElement.innerHTML = html;
	});

	describe('formula bar', () => {
		it('makes changes TO the value of the current cell', () => {
			const model = new TableModel(3, 3);
			const view = new TableView(model);
			view.init();

			let trs = document.querySelectorAll('TBODY TR');
			let td = trs[0].cells[0];
			expect(td.textContent).toBe('');

			document.querySelector('#formula-bar').value = '65';
			view.handleFormulaBarChange();

			trs = document.querySelectorAll('TBODY TR');
			expect(trs[0].cells[0].textContent).toBe('65');
		});
		
		it('updates FROM the value of the current cell', () => {
			const model = new TableModel(3, 3);
			const view = new TableView(model);
			model.setValue({ col: 2, row: 1 }, '123');
			view.init();

			const formulaBarEl = document.querySelector('#formula-bar');
			expect(formulaBarEl.value).toBe('');

			const trs = document.querySelectorAll('TBODY TR');
			trs[1].cells[2].click();

			expect(formulaBarEl.value).toBe('123');
		});
	});

	describe('table body', () => {
		it('highlights the current cell when clicked', () => {
			const model = new TableModel(10, 5);
			const view = new TableView(model);
			view.init();

			let trs = document.querySelectorAll('TBODY TR');
			let td = trs[2].cells[3];
			expect(td.className).toBe('');

			td.click();

			trs = document.querySelectorAll('TBODY TR');
			td = trs[2].cells[3];
			expect(td.className).not.toBe('');
		});

		it('has the right size', () => {
			const numCols = 6;
			const numRows = 10;
			const model = new TableModel(numCols, numRows);
			const view = new TableView(model);
			view.init();

			let ths = document.querySelectorAll('THEAD TH');
			expect(ths.length).toBe(numCols);
		});

		it('fills in values from the model', () => {
			const model = new TableModel(3, 3);
			const view = new TableView(model);
			model.setValue({col: 2, row: 1}, '123');
			view.init();

			const trs = document.querySelectorAll('TBODY TR');
			expect(trs[1].cells[2].textContent).toBe('123');
		});


	});

	describe('table header', () => {
		it('has valid column header labels', () => {
			const numCols = 6;
			const numRows = 10;
			const model = new TableModel(numCols, numRows);
			const view = new TableView(model);
			view.init();

			let ths = document.querySelectorAll('THEAD TH');
			expect(ths.length).toBe(numCols);
		});
	});
	// Write your test assertions as though another dev, 
	// way less familiar with your code than you, was going to read them. 
	// I'm not quite sure what "fills in values from the columns above it" means.

	describe('table footer', () => {
		it('renders a valid number from a cell in the adjacent column', () => {
			const model = new TableModel(3, 3);
			const view = new TableView(model);
			model.setValue({col: 0, row: 0}, 100);
			view.init();

			const tfs = document.querySelectorAll('TFOOT TR');
			expect(tfs[0].cells[0].textContent).toBe('100');
		});

		it('renders a valid sum of all the numbers of cells in the adjacent column', () => {
			const model = new TableModel(3, 3);
			const view = new TableView(model);
			model.setValue({col: 0, row: 0}, 10);
			model.setValue({col: 0, row: 1}, 20);
			model.setValue({col: 0, row: 2}, 30);
			view.init();

			const tfs = document.querySelectorAll('TFOOT TR');
			expect(tfs[0].cells[0].textContent).toBe('60');
		});

		// Add at least one test that tests against edge cases. 
		// For instance, it "calculates the sum correctly when non-numbers are included in the column".
		it('ignores when non-numbers are in the adjacent column and renders nothing in the adjacent footer', () => {
			const model = new TableModel(3, 3);
			const view = new TableView(model);
			model.setValue({col: 0, row: 0}, 'Harambe');
			model.setValue({col: 0, row: 1}, 'Is');
			model.setValue({col: 0, row: 2}, 'Alive');
			view.init();

			const tfs = document.querySelectorAll('TFOOT TR');
			expect(tfs[0].cells[0].textContent).toBe('')
		});

		it('calculates the sum correctly when non-numbers are included with numbers in the column', () => {
			const model = new TableModel(3, 3);
			const view = new TableView(model);
			model.setValue({col: 0, row: 0}, 10);
			model.setValue({col: 0, row: 1}, 'A');
			model.setValue({col: 0, row: 2}, 30);
			view.init();

			const tfs = document.querySelectorAll('TFOOT TR');
			expect(tfs[0].cells[0].textContent).toBe('40')
		});

	});
});