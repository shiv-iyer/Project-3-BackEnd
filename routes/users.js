// Route for users: registration

const express = require("express");
const router = express.Router();
// crypto: for hashing passwords
const crypto = require("crypto");

// function to generate a hashed password
const getHashedPassword = (password) => {
    const sha256 = crypto.createHash("sha256");
    const hash = sha256.update(password).digest("base64");
    return hash;
}

// import in the User model
const { User } = require("../models");

// import in the form stuff
const { createRegistrationForm, createLoginForm, bootstrapField } = require("../forms");
const { create } = require("hbs");

// route to create the registration form
router.get("/register", (req, res) => {
    // display the registration form
    const registerForm = createRegistrationForm();
    res.render("users/register", {
        "form": registerForm.toHTML(bootstrapField)
    });
});

// route to process the registration form
router.post("/register", (req, res) => {
    const registerForm = createRegistrationForm();
    registerForm.handle(req, {
        "success": async (form) => {
            const user = new User({
                "first_name": form.data.first_name,
                "last_name": form.data.last_name,
                "username": form.data.username,
                // generate a hashed password of the user's password
                "password": getHashedPassword(form.data.password),
                "email": form.data.email,
                "contact_number": form.data.contact_number
            });
            await user.save();
            req.flash("success_messages", "New user has signed up successfully!");
            res.redirect("/users/login")
        },
        "error": (form) => {
            res.render("users/register", {
                'form': form.toHTML(bootstrapField)
            });
        }
    });

});

// route for user login page
router.get("/login", (req, res) => {
    // create the login form
    const loginForm = createLoginForm();
    res.render("users/login", {
        'form': loginForm.toHTML(bootstrapField)
    });
});

// route for processing user login
router.post("/login", (req, res) => {
    const loginForm = createLoginForm();
    loginForm.handle(req, {
        'success': async (form) => {
            // process login

            // find user by email
            let user = await User.where({
                // match the form fields
                'email': form.data.email
            }).fetch({
                require: false
            });

            // if no user was found with the provided email, throw an error
            if (!user){
                req.flash("error_messages", "Sorry, but there was no user found with the specified email address. Please try again.");
                res.redirect("/users/login");
            } else {
                // if user found, check if the password details match
                // we need to compare the password in the database (hashed from before) with a hashed version of the form's password
                if (user.get('password') === getHashedPassword(form.data.password)) {
                    // store user details in the session
                    const username = user.get('username');
                    req.session.user = {
                        id: user.get('id'),
                        username: username,
                        email: user.get('email')
                    };
                    req.flash("success_messages", "Welcome back, " + username + "!");
                    res.redirect("/users/profile");
                }  else {
                    req.flash("error_messages", "Sorry, but the password you provided was incorrect. Please try again.");
                    res.redirect("/users/login");
                };
            }
        },
        'error': (form) => {
            // req.flash("error_messages", "Sorry, there were some errors logging you in. Please try filling the form out again.");
            res.render("users/login", {
                'form': form.toHTML(bootstrapField)
            });
        }
    })
});

// route for user profile
router.get("/profile", (req, res) => {
    // get user from the current session
    const user = req.session.user;
    // if no user exists... don't load the page, and redirect to the login page
    if (!user) {
        req.flash("error_messages", "Sorry, you do not have permission to view this page. Please log in.");
        res.redirect("/users/login");
    } else {
        // otherwise, load the profile with the user
        res.render("users/profile", {
            'user': user
        });
    };
});

// logout route
router.get("/logout", (req, res) => {
    // terminate the user in the session (set to null)
    req.session.user = null;
    req.flash("success_messages", "Goodbye, come again soon!");
    res.redirect("/users/login");
});


module.exports = router;