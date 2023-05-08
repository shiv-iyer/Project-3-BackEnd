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
  return db.createTable('orders', {
    id: {type: 'int', primaryKey: true, autoIncrement: true, unsigned: true},
    user_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'orders_user_fk',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        // mapping is mapping
        mapping: 'id'
      }
    },
    order_status_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'orders_order_status_fk',
        table: 'order_status',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        // mapping is mapping
        mapping: 'id'
      }
    },
    total_cost: {type: 'int', unsigned: true, notNull: true},
    order_date: {type: 'datetime', notNull: true},
    shipping_country: {type: 'string', length: 45, notNull: true},
    shipping_postal_code: {type: 'string', length: 15, notNull: true},
    shipping_address_line_1: {type: 'string', length: 100, notNull: true},
    shipping_address_line_2: {type: 'string', length: 100, notNull: true},
    billing_country: {type: 'string', length: 45, notNull: false},
    billing_postal_code: {type: 'string', length: 15, notNull: false},
    billing_address_line_1: {type: 'string', length: 100, notNull: false},
    billing_address_line_2: {type: 'string', length: 100, notNull: false},
    delivery_instructions: {type: 'text', notNull: false},
    payment_type: {type: 'string', length: 50, notNull: true},
    // stripe ID to retrieve the order later
    stripe_id: {type: 'string', length: 2048, notNull: true}
  });
};

// down deletes table
exports.down = function(db) {
  return db.dropTable('orders');
};

exports._meta = {
  "version": 1
};
