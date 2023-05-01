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

const Type = bookshelf.model('Type', {
    tableName: 'types',
    // it is through cards so we use card
    card() {
        // when many many, use belongsToMany
        return this.belongsToMany('Card');
    }
})

// export the Card object that stores the Card model out
module.exports = {Card, Expansion, Type};