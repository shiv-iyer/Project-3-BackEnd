// Cards file — all routes pertaining to cards will be here

// get Express
const express = require("express");
// use the Express Router
const router = express.Router();

// ★ Step #1: import in the Card model from the models module
const {Card} = require('../models');

// import in forms
const { createCardForm, bootstrapField } = require ("../forms");

// import in the card data layer
const cardDataLayer = require("../DAL/cards");

// import in the middleware to protect the route
const { checkIfAuthenticated } = require("../middlewares");

// res.render will automatically go to the views folder,
// because we set the view engine to handlebars, we don't need to write index.hbs, just index
router.get("/", async (req, res) => {
    // ★ Step #2: fetch all of the cards (ie. executes the following SQL code: SELECT * from cards)
    // (refactored to go into the DAL)
    const cards = await cardDataLayer.getAllCards();
    // console.log(cards.toJSON());
    // const cards = await Card.collection().fetch();
    // ★ Step #3: convert the retrieved collection to JSON, and pass it to the index.hbs file in the cards folder within views
    res.render("cards/index", {
        'cards': cards.toJSON()
    });
});

// second function for Cards, to render the form for creation
// we add the checkIfAuthenticated middleware in between the route
router.get("/create", checkIfAuthenticated, async (req, res) => {
    // initialize expansions
    const allExpansions = await cardDataLayer.getAllExpansions();
    // now types too
    const allTypes = await cardDataLayer.getAllTypes();
    const cardForm = createCardForm(allExpansions, allTypes);
    res.render('cards/create', {
        // format the form using Bootstrap styles
        'form': cardForm.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
});

// route to process the form once it's submitted
router.post("/create", checkIfAuthenticated, async (req, res) => {
    const allExpansions = await cardDataLayer.getAllExpansions();
    const allTypes = await cardDataLayer.getAllTypes();
    const cardForm = createCardForm(allExpansions, allTypes);
    // use the handle function of the form to process the request
    cardForm.handle(req, {
        // success function: function to be run when the form is successfully processed
        'success': async (form) => {
            // create a new Card object from the Card model, which represents one row in the table
            // instead of hardcoding all the fields with card.set, we can just pass in form.data here

            // destructure the form
            let {types, ...cardData} = form.data;
            // create the card with every field except types
            const card = new Card(cardData);
            await card.save();

            // save the many to many relationship 
            // if the user selected types:
            if (types) {
                // card.type instead of card.types() because the relationship name is type singular
                await card.type().attach(types.split(","));
            }

            req.flash("success_messages", `New card ${card.get('name')} has been successfully created!`);

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

// fourth route for Cards, to update!
router.get("/:card_id/update", async (req, res) => {
    // get the card ID from the request's parameters
    const cardId = req.params.card_id;
    // retrieve the card first
    const card = await Card.where({
        'id': cardId
    }).fetch({
        require: true,
        // with related for many to many relationship with type
        withRelated:['type']
    });

    const allExpansions = await cardDataLayer.getAllExpansions();
    const allTypes = await cardDataLayer.getAllTypes();
    const cardForm = createCardForm(allExpansions, allTypes);

    // fill in all of the fields in the form with the card's existing values
    cardForm.fields.name.value = card.get('name');
    cardForm.fields.rarity.value = card.get('rarity');
    cardForm.fields.format.value = card.get('format');
    cardForm.fields.condition.value = card.get('condition');
    cardForm.fields.cost.value = card.get('cost');
    cardForm.fields.stage.value = card.get('stage');
    cardForm.fields.hit_points.value = card.get('hit_points');
    cardForm.fields.flavor_text.value = card.get('flavor_text');
    cardForm.fields.expansion_id.value = card.get('expansion_id');

    // newly added: image url!
    cardForm.fields.image_url.value = card.get('image_url');

    // thumb url
    cardForm.fields.thumbnail_url.value = card.get('thumbnail_url');

    // pluck to retrieve types
    let selectedTypes = await card.related('type').pluck('id');
    cardForm.fields.types.value = selectedTypes;

    // cardForm.fields.image_url.value = card.get('image_url');
    // cardForm.fields.thumbnail_url.value = card.get('thumbnail_url');

    // render the form with these updated values
    res.render('cards/update', {
        'form': cardForm.toHTML(bootstrapField),
        'card': card.toJSON(),
        // same as before: pass in the cloudinary details
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    });

});

// route to process the updated card form
router.post('/:card_id/update', async (req, res) => {
    const cardId = req.params.card_id;
    // first, fetch the card that we want to update
    const card = await Card.where({
        'id': cardId
    }).fetch({
        require: true,
        // load with the relationship to types
        withRelated:['type']
    });

    // next, process the form, if successful we use card.set to overwrite the original card's data with the new data from the form
    const allExpansions = await cardDataLayer.getAllExpansions();
    const allTypes = await cardDataLayer.getAllTypes();
    const cardForm = createCardForm(allExpansions, allTypes);
    cardForm.handle(req, {
        'success': async (form) => {
            // same as before, we destructure the form and set all fields except types, then do types after
            let {types, ...cardData} = form.data;
            card.set(cardData);
            card.save();

            // update the types
            let typeIds = types.split(',');
            let existingTypeIds = await card.related('type').pluck('id');

            // remove all the types that aren't selected anymore
            let toRemove = existingTypeIds.filter(id => typeIds.includes(id) === false);
            await card.type().detach(toRemove);
            
            // add in all the types selected in the form
            await card.type().attach(typeIds);

            req.flash("success_messages", `Card ${card.get('name')} has been successfully updated!`);

            res.redirect('/cards');
        },
        // if there's an error with the form, just re-render the form to display the error messages
        'error': async (form) => {
            res.render('cards/update', {
                'form': form.toHTML(bootstrapField),
                'card': card.toJSON()
            })
        }
    });
});

// CRU complete. final routing requirements: for deletion.
router.get('/:card_id/delete', async (req, res) => {
    const cardId = req.params.card_id;
    // fetch the card to be deleted
    const card = await Card.where({
        'id': cardId
    }).fetch({
        require: true
    });

    // render the deletion hbs file, passing in the card to be deleted
    res.render('cards/delete', {
        'card': card.toJSON()
    });
});

// process the deletion
router.post('/:card_id/delete', async (req, res) => {
    const cardId = req.params.card_id;
    // fetch the card to be deleted
    const card = await Card.where({
        'id': cardId
    }).fetch({
        require: true
    });
    
    // flash message before deletion so we can get the name of the card.
    req.flash("success_messages", `Card ${card.get('name')} has been successfully deleted!`);

    // delete the card.
    await card.destroy();
    res.redirect('/cards');
})

// export the Router out
module.exports = router;