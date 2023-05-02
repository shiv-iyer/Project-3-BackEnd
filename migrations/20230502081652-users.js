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
  return db.createTable('users', {
    id: {type: 'int', primaryKey: true, autoIncrement: true, unsigned: true},
    first_name: {type: 'string', length: 45, notNull: true},
    last_name: {type: 'string', length: 45, notNull: true},
    username: {type: 'string', length: 20, notNull: true},
    password: {type: 'string', length: 100, notNull: true},
    email: {type: 'string', length: 320, notNull: true},
    contact_number: {type: 'string', length: 15, notNull: true}
  });
};

// down is to drop the table
exports.down = function(db) {
  return db.dropTable('users');
};

exports._meta = {
  "version": 1
};
