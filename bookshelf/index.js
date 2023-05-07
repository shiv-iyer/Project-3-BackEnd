// Bookshelf is an ORM (Object Relational Mapper) solution
// We use it for: independence from SQL syntax (or any other database) — our code will work with all kinds of SQL databases
// also, most ORM solutions, such as Bookshelf, have some basic security included.

// Set up the database connection; details should match those in database.json
const knex = require('knex')({
    client: process.env.DB_DRIVER,
    connection: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST
    }
});

const bookshelf = require('bookshelf')(knex);

// export bookshelf
module.exports = bookshelf;