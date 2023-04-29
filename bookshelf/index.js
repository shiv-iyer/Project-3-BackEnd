// Bookshelf is an ORM (Object Relational Mapper) solution
// We use it for: independence from SQL syntax (or any other database) — our code will work with all kinds of SQL databases
// also, most ORM solutions, such as Bookshelf, have some basic security included.

// Set up the database connection; details should match those in database.json
const knex = require('knex')({
    client: 'mysql',
    connection: {
        user: 'foo',
        password: 'bar',
        database: 'pokeport',
        host: '127.0.0.1'
    }
});

const bookshelf = require('bookshelf')(knex);

// export bookshelf
module.exports = bookshelf;