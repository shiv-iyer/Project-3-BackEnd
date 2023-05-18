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

// inserting mock data
exports.up = function(db) {
  return db.runSql("INSERT into types (type) values ('Grass'), ('Fire'), ('Water'), ('Lightning'), ('Fighting'), ('Psychic'), ('Colorless'), ('Darkness'), ('Metal'), ('Dragon'), ('Fairy')");
};

// no down
exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
