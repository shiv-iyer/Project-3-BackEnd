// Cards file — all routes pertaining to cards will be here

// get Express
const express = require("express");
// use the Express Router
const router = express.Router();

// ★ Step #1: import in the Card model from the models module
const {Card} = require('../models');

// import in forms
const { createCardForm, bootstrapField } = require ("../forms");

// res.render will automatically go to the views folder,
// because we set the view engine to handlebars, we don't need to write index.hbs, just index
router.get("/", async (req, res) => {
    // ★ Step #2: fetch all of the cards (ie. executes the following SQL code: SELECT * from cards)
    const cards = await Card.collection().fetch();
    // ★ Step #3: convert the retrieved collection to JSON, and pass it to the index.hbs file in the cards folder within views
    res.render("cards/index", {
        'cards': cards.toJSON()
    });
});

// second route for Cards, to render the form for creation
router.get("/create", async (req, res) => {
    const cardForm = createCardForm();
    res.render('cards/create', {
        // format the form using Bootstrap styles
        'form': cardForm.toHTML(bootstrapField)
    })
});

// export the Router out
module.exports = router;