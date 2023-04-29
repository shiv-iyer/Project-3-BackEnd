// Set up the database connection
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