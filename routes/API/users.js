const express = require("express");
const router = express.Router();
const crypto = require("crypto");
// JSON Web Token
const jwt = require("jsonwebtoken");
// Middleware auth
const {checkIfAuthenticatedJWT} = require ("../../middlewares");

// user and blacklisted token models
const { User, BlacklistedToken } = require ("../../models");

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
        res.json({
            "accessToken": accessToken, "refreshToken": refreshToken
        });
    } else {
        res.send({
            'error': 'Wrong email or password'
        });
    }
});

// need a register route... missing
router.post("/register", async (req, res) => {
    let reqIsNull = false;
    try {
        // if either of these are null, don't register in the database
        for (deets in req.body) {
            if (req.body[deets] === "" || !req.body[deets]){
                reqIsNull = true;
            }
        }

        if (reqIsNull === false){
            let { password, ...userData } = req.body;
    
            const user = new User({
                ... userData,
                "password": getHashedPassword(password)
            });
        
            await user.save();
    
            // send success code to frontend
            res.status(200).send(user);
        } else {
            res.send("you need to fill in the form properly");
        }
    } catch (e) {
        // if error send wrong status
        res.status(500).send("Error")
    }
});

router.get("/profile", checkIfAuthenticatedJWT, async (req, res) => {
    const user = req.user;
    res.send(user);
});

// allow the client to get a new access token
router.post("/refresh", async (req, res) => {
    let refreshToken = req.body.refreshToken;
    // prevent access if no refresh token
    if (!refreshToken) {
        res.sendStatus(401);
    }

    // check if the refresh token has been blacklisted
    let blacklistedToken = await BlacklistedToken.where({
        'token': refreshToken
    }).fetch({
        require: false
    });

    // if the refresh token has already been blacklisted, don't proceed.
    if (blacklistedToken) {
        res.status(401);
        return res.send("The refresh token has already expired.");
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        let accessToken = generateToken(user, process.env.TOKEN_SECRET, "15m");
        res.send({
            accessToken
        });
    });
});

// route for logout; add refresh token to a black list
router.post("/logout", async (req, res) => {
    let refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.sendStatus(401);
    } else { 
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            const token = new BlacklistedToken();
            // set columns in the blacklisted token table. for date, use current date
            token.set('token', refreshToken);
            token.set('date_created', new Date ());
            await token.save();
            res.send({
                'message': 'User logged out'
            });
        });
    }
});

module.exports = router;