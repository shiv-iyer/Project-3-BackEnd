// A Model is a JavaScript class that represents one table. One instance of said model represents one row in the table.
// All models will go in index.js

// Use Bookshelf: from our previously written Bookshelf code
const bookshelf = require('../bookshelf');

// Create a Card Model using Bookshelf, and store it in the Card object
const Card = bookshelf.model('Card', {
    // the cards table from the pokeport database
    tableName: 'cards',
    expansion() {
        // referring to the expansion model
        // if not following the naming convention, also include the FK name
        // belongsTo singular is one to many
        return this.belongsTo("Expansion", "expansion_id");
    },
    // many to many with types
    type() {
        return this.belongsToMany("Type");
    },
    order_item() {
        this.hasMany("OrderItem");
    }
});

// Expansion Model
const Expansion = bookshelf.model('Expansion', {
    tableName: 'expansions',
    // define the relationship, models refer to other models
    card() {
        // referring to the card model
        return this.hasMany("Card");
    },
});

// Type Model
const Type = bookshelf.model('Type', {
    tableName: 'types',
    // it is through cards so we use card
    card() {
        // when many many, use belongsToMany
        return this.belongsToMany('Card');
    }
})

// User Model
const User = bookshelf.model('User', {
    tableName: 'users',
    order() {
        return this.hasMany('Order');
    }
});

// Cart Items Model
const CartItem = bookshelf.model('CartItem', {
    tableName: 'cart_items',
    card() {
        return this.belongsTo('Card');
    }
});

// ----- ORDER MODELS -----

// Order Status Model
const OrderStatus = bookshelf.model('OrderStatus', {
    tableName: 'order_status',
    order() {
        return this.hasMany('Order');
    }
});

// Order Model
const Order = bookshelf.model('Order', {
    tableName: 'orders',
    user() {
        return this.belongsTo('User');
    },
    order_status() {
        return this.belongsTo('OrderStatus');
    },
    order_item() {
        return this.hasMany('OrderItem');
    }
});

// Order Item Model
const OrderItem = bookshelf.model('OrderItem', {
    tableName: 'order_items',
    order() {
        return this.belongsTo('Order');
    },
    card() {
        return this.belongsTo('Card');
    }
});

const BlacklistedToken = bookshelf.model('BlacklistedToken', {
    tableName: 'blacklisted_tokens'
});


// export the Card object that stores the Card model out
module.exports = {Card, Expansion, Type, User, CartItem, OrderStatus, Order, OrderItem, BlacklistedToken};