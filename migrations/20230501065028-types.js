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

// up is to create the table
exports.up = function(db) {
  return db.createTable('types', {
    id: {type: 'int', primaryKey: true, autoIncrement: true, unsigned: true},
    type: {type: 'string', length: 9, notNull: true}
  });
};

// down is to drop the table
exports.down = function(db) {
  return db.dropTable('types');
};

exports._meta = {
  "version": 1
};
