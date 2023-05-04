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

// exports up to add the column
exports.up = function(db) {
  return db.addColumn('cards', 'thumbnail_url', {
    type: 'string',
    length: 2048
    // optional so null
  });
};

// exports down to remove the column
exports.down = function(db) {
  return db.removeColumn('cards', 'thumbnail_url');
};

exports._meta = {
  "version": 1
};
