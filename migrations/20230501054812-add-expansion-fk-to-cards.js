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
  // adding a foreign key!
  // param 1: table for fk to be added to, param 2: table that fk refers to, param 3: fk name
  // naming convention: tableName_tableReferredTo_fk. and table referred to is singular
  return db.addForeignKey("cards", "expansions", "cards_expansion_fk", {
    // key: column name of the FK in the cards table
    // value: column name of the PK in the expansions table
    "expansion_id": "id"
  },
  {
    // cascade: delete all
    onDelete: 'CASCADE',
    // restrict: cannot be deleted
    onUpdate: 'RESTRICT'
  }
  );
};

exports.down = function(db) {
  // remove the FK
  // param 1: table name, param 2: foreign key name
  return db.removeForeignKey("cards", "cards_expansion_fk");
};

exports._meta = {
  "version": 1
};
