// preemptive requirements
const express = require("express");
const hbs = require("hbs");
const wax = require('wax-on');
require("dotenv").config();

// other requirements: for session
const session = require("express-session");
const flash = require("connect-flash");
const FileStore = require("session-file-store")(session);

// csurf / csrf module
const csrf = require("csurf");

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

// set up flash messages
app.use(flash());

// register Flash middleware
app.use(function (req, res, next) {
    // store Flash in res.locals: res.locals stores variables that are available to all hbs files
    res.locals.success_messages = req.flash("success_messages");
    res.locals.error_messages = req.flash("error_messages");
    next();
})

// Global Middleware for index.js: share the user session data with .hbs files via res.locals
app.use(function(req, res, next){
    res.locals.user = req.session.user;
    next();
});

// Enable csrf for all routes
app.use(csrf());

// handle csrf error
app.use(function (err, req, res, next) {
    if (err && err.code == "EBADCSRFTOKEN") {
        req.flash("error_messages", "The form has expired. Please try again!");
        res.redirect("back");
    } else {
        next()
    }
});

// Global Middleware for index.js: share the CSRF Token with .hbs files via res.locals
app.use(function(req, res, next){
    res.locals.csrfToken = req.csrfToken();
    next();
});

// import the card route
const cardRoute = require("./routes/cards.js");

// next, import in the user route
const userRoute = require("./routes/users.js");

// cloudinary route for image uploading
const cloudinaryRoute = require("./routes/cloudinary.js");

// cart route for shopping cart
const cartRoute = require("./routes/shoppingCart.js");

// main function
async function main() {

    // instead of app.get, we use app.use because we are using our route
    // all the app.gets will be inside the routes
    app.use("/cards", cardRoute);
    // users route
    app.use("/users", userRoute);
    // cloudinary route
    app.use("/cloudinary", cloudinaryRoute);
    // shopping cart route
    app.use("/cart", cartRoute);
}

main();

app.listen(3000, () => {
    console.log("Server has started WOO");
});