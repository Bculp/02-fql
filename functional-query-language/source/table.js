'use strict';

var fs = require('fs');

function Table (folderPath) {
  this.folderPath = folderPath;
}

// example
// 0 => '0000.json'
Table.toFilename = function (id) {
  var filename = (`000${id}.json`).slice(-9);
  return filename;
};

// example
// '0000.json' => 0
Table.toId = function (filename) {
  var id = parseInt(filename);
  return id;
};

// example
// 0 => {
//   "id": 0,
//   "name": "Aliens",
//   "year": 1986,
//   "rank": 8.2
// }
Table.prototype.read = function (id) {
  var filepath = `${this.folderPath}/${Table.toFilename(id)}`;
  var filecontents = fs.readFileSync(filepath);
  var row = JSON.parse(filecontents);
  return row;
};

// example
// => [0,1,2,5,6]
Table.prototype.getRowIds = function () {
  var filenames = fs.readdirSync(this.folderPath);
  var rowIds = filenames.map(Table.toId);
  return rowIds;
};

module.exports = Table;
