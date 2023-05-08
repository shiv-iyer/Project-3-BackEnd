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
  return db.createTable('order_items', {
    id: {type: 'int', primaryKey: true, autoIncrement: true, unsigned: true},
    order_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'order_items_orders_fk',
        table: 'orders',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        // mapping is mapping
        mapping: 'id'
      }
    },
    card_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'order_items_card_fk',
        table: 'cards',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        // mapping is mapping
        mapping: 'id'
      }
    },
    quantity: {type: 'smallint', unsigned: true, notNull: true}
  });
};

// down drops table
exports.down = function(db) {
  return db.dropTable('order_items');
};

exports._meta = {
  "version": 1
};
