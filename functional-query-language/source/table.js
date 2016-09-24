'use strict';

var fs = require('fs');
var FQL = require('./fql')

function Table (folderPath) {
  this.folderPath = folderPath;
  this.indices = {}
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

Table.prototype.hasIndexTable = function(column) {
  if(!this.indices[column]) return false;
  return true;
}

Table.prototype.addIndexTable = function(column) {
  var query = new FQL(this);
  var rows = query.select('id', column).get();
  var index = {};
  this.indices[column] = index;
   while (rows.length > 0) {
    var row = rows.shift();
    var id = row.id;
    var key = row[column];
    if (!index[key]) index[key] = [];
    index[key].push(id);
  }
}

Table.prototype.getIndexTable = function(column) {
  return this.indices[column];
}


module.exports = Table;
