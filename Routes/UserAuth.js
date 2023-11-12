const express = require('express');
const router = express.Router();
const allModels = require('../Databases/allModels');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Jwt_secret = "sk-programmer";

// Middleware to fetch user information from a valid JWT token
const fetchUser = require('../middlewares/fetchuser');

// Route to create a new user
router.post('/createuser', [
    // Request body validation using Express Validator
    body("name", "Enter a valid name").isLength({ min: 5, max: 20 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a password").isLength({ min: 6 }),
    body("contactNumber", "Your number is not valid").isLength({ min: 10, max: 10 }),
], async (req, res) => {
    const { User, Bloger } = allModels;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Return validation errors if there are any
        return res.status(400).json({ errors: errors.array() });
    } else {
        try {
            // Check if a user or bloger with the same email exists
            const user = await User.findOne({ email: req.body.email }, { contactNumber: req.body.contactNumber });
            const userAsBloger = await Bloger.findOne({ email: req.body.email });
            if (user || userAsBloger) {
                // Return an error if a user or bloger with the same email already exists
                return res.status(400).json({ status: false, error: "User already exists or exists as a bloger" });
            }
            // Hash the user's password before storing it in the database
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            // Create a new user with the provided data
            const userData = {
                image: req.body.image,
                name: req.body.name,
                email: req.body.email,
                contactNumber: req.body.contactNumber,
                password: hashedPassword,
            };
            const createdUser = await User.create(userData);
            const data = { user: { id: createdUser.id } };
            // Generate a JWT token for the newly created user
            const authToken = jwt.sign(data, Jwt_secret);
            res.json({ login: true, authToken: authToken });
        } catch (err) {
            // Handle server error if something goes wrong
            res.status(500).send({ login: false, error: "Some error occurred" });
        }
    }
});

// Route for user login
router.post('/login', [
    // Request body validation using Express Validator
    body('email', "Enter a valid Email").isEmail(),
    body('password', "Password can't be blank").exists(),
], async (req, res) => {
    const { User } = allModels;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Return validation errors if there are any
        return res.status(400).json({ login: false, error: "Please try to log in with the correct credentials" });
    }

    const { email, password } = req.body;

    try {
        // Find the user with the provided email
        const user = await User.findOne({ email });
        if (!user) {
            // Return an error if no user with the provided email exists
            return res.status(400).json({ login: false, error: "Please try to log in with the correct credentials" });
        }

        // Compare the provided password with the stored hashed password
        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) {
            // Return an error if the password does not match
            return res.status(400).json({ login: false, error: "Please try to log in with the correct credentials" });
        }

        const data = { user: { id: user.id } };
        // Generate a JWT token for the authenticated user
        const authToken = jwt.sign(data, Jwt_secret);
        res.json({ login: true, authToken });
    } catch (error) {
        // Handle server error if something goes wrong
        res.status(500).send({ login: false, error: "Some error occurred" });
    }
});

// Route to get user information
router.get('/fetch_me', fetchUser, async (req, res) => {
    try {
        const { User } = allModels;
        const userId = req.user.id;
        // Find the user by their ID and exclude the password from the response
        const user = await User.findById(userId).select("-password");
        res.send({ status: true, user });
    } catch (error) {
        // Handle server error if something goes wrong
        res.status(500).send({ status: false, error: "Some error occurred" });
    }
});

// Route to update user information
router.put("/update", fetchUser, async (req, res) => {
    try {
        const { User } = allModels;
        const userId = req.user.id;
        // Hash the new password before updating the user's information
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const userData = {
            image: req.body.image,
            name: req.body.name,
            password: hashedPassword,
        };
        // Find and update the user's information
        const user = await User.findByIdAndUpdate(userId, userData);
        const updatedUser = await User.findById(userId);
        if (user) {
            // Send a success response with the updated user's data
            res.status(200).send({ update: true, newUser: updatedUser });
        } else {
            // Handle server error if the update fails
            res.status(500).send({ update: false, data: "Some error occurred" });
        }
    } catch (error) {
        // Handle server error if something goes wrong
        res.status(500).send({ update: false, data: "Some error occurred" });
    }
});

module.exports = router;
