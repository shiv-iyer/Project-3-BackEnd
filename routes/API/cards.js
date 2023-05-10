const express = require("express");
const router = express.Router();

const cardDataLayer = require("../../DAL/cards");

// imports to create a new card
const { Card } = require("../../models/index");
const { createCardForm } = require("../../forms/index");

router.get("/", async (req, res) => {
    res.send(await cardDataLayer.getAllCards());
});

router.post("/", async (req, res) => {
    const allExpansions = cardDataLayer.getAllExpansions();
    const allTypes = cardDataLayer.getAllTypes();
    const cardForm = createCardForm(allExpansions, allTypes);

    cardForm.handle(req, {
        'success': async (form) => {
            let {types, ...cardData} = form.data;
            const card = new Card(cardData);
            await card.save();

            // save the many to many relationship
            if (types) {
                await card.type().attach(types.split(","));
            }
            // haikal is god
            res.send(card).sendStatus(200);
        },
        'error': async (form) => {
            let errors = {};
            for (let key in form.fields) {
                if (form.fields[key].error) {
                    errors[key] = form.fields[key].error;
                }
            }
            res.send(JSON.stringify(errors));
        }
    });
});

// TODO: update?

// process the delete
router.post('/:card_id/delete', async (req, res) => {
    const cardId = req.params.card_id;
    try {
        // fetch the card to be deleted
        const card = await Card.where({
            'id': cardId
        }).fetch({
            require: true
        });

        // delete the card.
        await card.destroy();
        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(403);
    }
});

module.exports = router;