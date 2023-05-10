// Middleware code will execute before a route is accessed, so we can write code here that we want to run before the
// code in the route executes. We just need to assign that middleware to the route

const jwt = require("jsonwebtoken");

// midldeware to check if user is authenticated
// it will take in an req, res, and next.
const checkIfAuthenticated = (req, res, next) => {
    // the next function is provided by Express : when called, Express will move onto the next middleware.
    // if there aren't any more middlewares to be called, the route will be executed.
    if (req.session.user)
        next();
    else {
        req.flash("error_messages", "Sorry, but you need to sign in to access this page.");
        res.redirect("/users/login");
    }
};

// JWT Middleware code
const checkIfAuthenticatedJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

module.exports = { checkIfAuthenticated, checkIfAuthenticatedJWT };