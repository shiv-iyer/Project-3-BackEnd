// Route for users: registration

const express = require("express");
const router = express.Router();

// import in the User model
const { User } = require("../models");

// import in the form stuff
const { createRegistrationForm, bootstrapField } = require("../forms");
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
                "password": form.data.password,
                "email": form.data.email,
                "contact_number": form.data.contact_number
            });
            await user.save();
            req.flash("success_messages", "New user has signed up successfully!");
            res.redirect("/users/login")
        },
        "error": (form) => {
            res.render("/users/register", {
                'form': form.toHTML(bootstrapField)
            });
        }
    });

});

// route for user login page
router.get("/login", (req, res) => {
    res.render("users/login");
})

module.exports = router;