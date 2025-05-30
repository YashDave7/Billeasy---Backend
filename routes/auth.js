const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// ROUTE 1: Create a User:- POST "/signup".
router.post('/signup', [
    // Validations Using express-validator.
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Enter a 8 character password').isLength({ min: 8 })
], async (req, res) => {
    // If there are errors, return the bad request and the errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // Check whether user with this Email already exists.
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "User with this Email already exist" })
        }

        // Hashing Password.
        const salt = await bcrypt.genSalt();
        securePassword = await bcrypt.hash(req.body.password, salt);

        // Adding user to the Database.
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: securePassword
        })

        const data = {
            user: {
                id: user.id
            }
        }

        // CREATING authToken.
        const authToken = jwt.sign(data, process.env.JWT_SECRET);
        console.log("authToken = ", authToken);
        res.json({ authToken });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 2: Authenticate a User(User Login) : POST "/login".
router.post('/login', [
    body('email', 'Enter the Email').isEmail(),
    body('password', 'Enter password').exists()
], async (req, res) => {
    // If there are errors, return the bad request and the errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // CHECKING IF USER WITH THIS EMAIL EXIST OR NOT.
        let user = await User.findOne({ email });
        if (!user) {
            console.log("Email not Registered, Please Signup");

            return res.status(400).json({ error: "Email not Registered, Please Signup" });
        }

        // COMPARING THE ENTERED PASSWORD WITH USER PASSWORD.
        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            return res.status(400).json({ error: "Incorrect Password" });
        }

        const data = {
            user: {
                id: user.id
            }
        }

        // CREATING authToken.
        const authToken = jwt.sign(data, process.env.JWT_SECRET);
        res.json({ authToken });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;