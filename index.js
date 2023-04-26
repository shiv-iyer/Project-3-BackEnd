// preemptive requirements
const express = require("express");
const hbs = require("hbs");
const wax = require('wax-on');
require("dotenv").config();

// create an instance of Express app
let app = express();

// Set the view engine to be Handlebars
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
    express.urlencoded({
        extended: false
    })
);

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
