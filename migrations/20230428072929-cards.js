// created our first migration, for cards! to create more: ./db-migrate.sh create <tableName>

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

// exports.up will create the table; match my logical schema diagram
// keys: name of the column, values: attributes of the column (data type, null or not, etc.)
// list of supported db-migrate data types: https://github.com/db-migrate/shared/blob/master/data_type.js
exports.up = function(db) {
  return db.createTable('cards', {
    id: { type: 'int', primaryKey: true, autoIncrement: true, unsigned: true},
    // for varchar 50, string with length 50
    name: { type: 'string', length: 50, notNull: true },
    rarity: { type: 'string', length: 12, notNull: true},
    format: { type: 'string', length: 9, notNull: true},
    condition: { type: 'string', length: 12, notNull: true},
    cost: { type: 'int', unsigned: true, notNull: true},
    stage: { type: 'string', length: 7, notNull: true},
    hit_points: { type: 'smallint', notNull: true},
    flavor_text: { type: 'text', notNull: true},
    image_url: { type: 'string', length: 2048, notNull: true},
    thumbnail_url: { type: 'string', length: 2048, notNull: true}
  });
};

// exports.down will delete the table
exports.down = function(db) {
  return db.dropTable('cards');
};

exports._meta = {
  "version": 1
};
