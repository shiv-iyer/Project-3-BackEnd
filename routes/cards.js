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

// second function for Cards, to render the form for creation
router.get("/create", async (req, res) => {
    const cardForm = createCardForm();
    res.render('cards/create', {
        // format the form using Bootstrap styles
        'form': cardForm.toHTML(bootstrapField)
    })
});

// Function to process the form once it's submitted
router.post("/create", async (req, res) => {
    const cardForm = createCardForm();
    // use the handle function of the form to process the request
    cardForm.handle(req, {
        // success function: function to be run when the form is successfully processed
        'success': async (form) => {
            // create a new Card object from the Card model, which represents one row in the table
            const card = new Card();
            // set all the fields from the form
            // name rarity format condition cost stage hit_points flavor_text image_url thumbnail_url
            card.set('name', form.data.name);
            card.set('rarity', form.data.rarity);
            card.set('format', form.data.format);
            card.set('condition', form.data.condition);
            card.set('cost', form.data.cost);
            card.set('stage', form.data.stage);
            card.set('hit_points', form.data.hit_points);
            card.set('flavor_text', form.data.flavor_text);
            card.set('image_url', form.data.image_url);
            card.set('thumbnail_url', form.data.thumbnail_url);
            await card.save();
            res.redirect('/cards');
        },
        // error function: in the event that there is an error. we can re-render the form with errors displayed.
        'error': async (form) => {
            res.render('cards/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
});

// third function for Cards, to update!


// export the Router out
module.exports = router;