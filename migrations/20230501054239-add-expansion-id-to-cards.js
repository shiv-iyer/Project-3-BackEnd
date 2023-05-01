'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  // adding a foreign key.
  // first parameter: table to add a column to. second parameter: id of the new column, singualar not plural
  return db.addColumn("cards", "expansion_id", {
    // expansion ID has to be the same as the primary key in expansion (ex. type mismatch will not work, both must be unsigned, etc.)
    type: "int",
    unsigned: true,
    notNull: true
  })
};

exports.down = function(db) {
  // remove column: first param table to remove a column from, second param column to be removed
  return db.removeColumn("cards", "expansion_id");
};

exports._meta = {
  "version": 1
};
