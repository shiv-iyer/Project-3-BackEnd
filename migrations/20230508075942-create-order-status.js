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

// up creates table
exports.up = function(db) {
  return db.createTable('order_status', {
    id: {type: 'int', primaryKey: true, autoIncrement: true, unsigned: true},
    status: {type: 'string', length: 45, notNull: true}
  });
};

// down drops table
exports.down = function(db) {
  return db.dropTable('order_status');
};

exports._meta = {
  "version": 1
};