// get Express
const express = require("express");
// use the Express Router
const router = express.Router();

// res.render will automatically go to the views folder,
// because we set the view engine to handlebars, we don't need to write index.hbs, just index
router.get("/", (req, res) => {
    res.render("cards/index");
});

// export the Router out
module.exports = router;