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
  return db.createTable('cards_types', {
    id: {type: 'int', primaryKey: true, autoIncrement: true, unsigned: true},
    // can custom write the foreign key while creating the table
    card_id: {
      // same data structure as the primary key in cards
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        // naming convention: tableName_secondTableName_tableReferringTo_fk
        name: 'cards_types_card_fk',
        table: 'cards',
        // same rules as last time
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        // mapping is mapping
        mapping: 'id'
      }
    },
    type_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'cards_types_type_fk',
        table: 'types',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        // mapping is mapping
        mapping: 'id'
      }
    },
  });
};

exports.down = function(db) {
  return db.dropTable('cards_types');
};

exports._meta = {
  "version": 1
};
