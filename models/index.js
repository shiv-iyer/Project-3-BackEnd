// A Model is a JavaScript class that represents one table. One instance of said model represents one row in the table.

// Use Bookshelf: from our previously written Bookshelf code
const bookshelf = require('../bookshelf');

// Create a Card Model using Bookshelf, and store it in the Card object
const Card = bookshelf.model('Card', {
    // the cards table from the pokeport database
    tableName: 'cards'
});

// export the Card object that stores the Card model out
module.exports = {Card};