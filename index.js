// preemptive requirements
const express = require("express");
const hbs = require("hbs");
const wax = require('wax-on');
require("dotenv").config();

// other requirements: for session
const session = require("express-session");
const flash = require("connect-flash");
const FileStore = require("session-file-store")(session);

// create an instance of Express app
let app = express();

// Set the view engine to be Handlebars
app.set("view engine", "hbs");

// static folder
// essentially, contains any content not from routes (CSS files, images, and JS to run on the browser)
app.use(express.static("public"));

// I was receiving a weird error that stated my css file had the wrong MIME type, and strict MIME checking is enabled.
// therefore, a workaround using express.static and some built-in Node.js tools:

// built-in Node.js path module: which provides utilities for working with directories and file paths.
const path = require('path');

// using the express.static middleware to serve static files: from the assets folder. 
// the path.join code constructs an absolute path to the 'assets' folder; __dirname is a built-in Node.js variable that represents
// the directory of the currently executing script. therefore, we create an absolute path by joining the current directory with the assets
// folder's path. 
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms (by enabling req.body, without this req.body will be undefined)
app.use(
    express.urlencoded({
        extended: false
    })
);

// set up sessions, before importing routes
app.use(session({
    store: new FileStore(),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

// import the card route
const cardRoute = require("./routes/cards.js");

// main function
async function main() {

    // instead of app.get, we use app.use because we are using our route
    // all the app.gets will be inside the routes
    app.use("/cards", cardRoute);
}

main();

app.listen(3000, () => {
    console.log("Server has started WOO");
});