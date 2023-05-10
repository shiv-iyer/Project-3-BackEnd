const express = require("express");
const router = express.Router();
const crypto = require("crypto");
// JSON Web Token
const jwt = require("jsonwebtoken");
// Middleware auth
const {checkIfAuthenticatedJWT} = require ("../../middlewares");

const generateAccessToken = (user) => {
    return jwt.sign({
        'username': user.get('username'),
        'id': user.get('id'),
        'email': user.get('email'),
    }, process.env.TOKEN_SECRET, {
        expiresIn: "1h"
    });
};

// generalized function to generate a refresh token
const generateToken = (user, secret, expiresIn) => {
    return jwt.sign({
        'username': user.username,
        'id': user.id,
        'email': user.email
    }, secret, {
        expiresIn
    });
};

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash("sha256");
    const hash = sha256.update(password).digest("base64");
    return hash;
};

const { User } = require("../../models");

router.post("/login", async (req, res) => {
    console.log(req.body)
    let user = await User.where({
        'email': req.body.email
    }).fetch({
        require: false
    });


    if (user && user.get("password") == getHashedPassword(req.body.password)) {
        // OLD - before generalized function
        // let accessToken = generateAccessToken(user);
        // res.send({
        //     accessToken
        // });

        // use the general function; specify different expiration timings for each and send them to the user
        let accessToken = generateToken(user.toJSON(), process.env.TOKEN_SECRET, '15m');
        let refreshToken = generateToken(user.toJSON(), process.env.REFRESH_TOKEN_SECRET, '7d');
        res.send({
            accessToken, refreshToken
        });
    } else {
        res.send({
            'error': 'Wrong email or password'
        });
    }
});

router.get("/profile", checkIfAuthenticatedJWT, async (req, res) => {
    const user = req.user;
    res.send(user);
});

module.exports = router;