// preemptive requirements
const express = require('express');
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

// main function
async function main() {
    app.get("/", (req, res) => {
        res.send("sup");
    });
}

main();

app.listen(3000, () => {
    console.log("Server has started WOO");
});
