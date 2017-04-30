class TableModel {
	constructor(numCols = 5, numRows = 10) {
		this.numCols = numCols;
		this.numRows = numRows;
		this.data = {};
	}

	_getCellId(location) {
		return `${location.col}:${location.row}`;
	}

	getValue(location){
		return this.data[this._getCellId(location)];
	}

	setValue(location,value){
		this.data[this._getCellId(location)] = value;
	}
/*
	getSumOfColumn(colPosition) {
		let sum = 0
		for (i = 0; i < numRows; i++) {
			let current = getValue(`${colPosition}:${i}`)
			if (!isNaN(current)){
				sum += current
			}
		}
		return sum
	}
*/
}

module.exports = TableModel;