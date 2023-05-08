// The Data Access Layer is for storing functions that are database-related
// anything to do with cards will go here, including expansions, types

// import in models related to cards
const {Card, Expansion, Type} = require("../models");

const getCardByID = async (cardID) => {
    const card = await Card.where({
        'id': parseInt(cardID)
    }).fetch({
        require: true,
        withRelated: ['expansion', 'type']
    });
    return card;
}

const getAllCards = async () => {
    const cards = await Card.collection().fetch({withRelated: ['expansion', 'type']});
    return cards;
};

// WIP
/*const addCard = async (card) => {

}*/

const getAllExpansions = async () => {
    // the reason we map is because of the Caolan Form: the way they read selects, so you need to return an array
    const expansions = await Expansion.fetchAll().map(e => [e.get("id"), e.get("name")]);
    return expansions;
};

const getAllTypes = async () => {
    const types = await Type.fetchAll().map(t => [t.get("id"), t.get("type")]);
    return types;
}

module.exports = {
    getAllCards,
    getAllExpansions,
    getAllTypes
}