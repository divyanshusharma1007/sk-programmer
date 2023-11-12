const express = require('express');
const router = express.Router();
const allModels = require('../Databases/allModels');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Jwt_secret = process.env.Jwt_secret; // Typo: Jwt_secret should be Jwt_secret (or Jwt_secret should be corrected wherever it's used).
const jwt = require('jsonwebtoken');
const fetchbloger = require('../middlewares/fetchbloger');

// Route to create a new bloger
router.post('/create-bloger', [
    // Request body validation using Express Validator
    body("name", "Enter a valid name").isLength({ min: 5, max: 20 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a password").isLength({ min: 6 }),
    body("contactNumber", "Your number is not valid").isLength({ min: 10, max: 10 }),
], async (req, res) => {
    // Requiring modules from the 'allModels' module
    const { Bloger } = allModels;
    // Validating the request body
    const errors = validationResult(req);

    // Checking the validation results
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } else {
        try {
            // Checking if a bloger with the same email exists
            let bloger = await Bloger.findOne({ email: req.body.email }, { contactNumber: req.body.contactNumber });
            if (bloger) {
                return res.status(400).json({ status: false, error: "Bloger already exists" });
            }
            // Hashing the password for security
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            // Converting the request data into the format for saving
            const bodyData = {
                image: req.body.image,
                name: req.body.name,
                email: req.body.email,
                contactNumber: req.body.contactNumber,
                gitHub: req.body.gitHub,
                programmingLanguage: req.body.programmingLanguage,
                password: hashedPassword,
            };
            // Saving the data to create a new bloger
            bloger = await Bloger.create(bodyData);
            // Creating an auth token with the bloger's ID
            const data = {
                bloger: {
                    id: bloger.id
                }
            };
            const authtoken = jwt.sign(data, Jwt_secret);
            res.json({ login: true, authtoken: authtoken });
        } catch (err) {
            // Handling server error if something goes wrong
            res.status(500).send({ login: false, error: "Some Error occurred" });
        }
    }
});

// Login route
router.post('/login', [
    // Request body validation using Express Validator
    body('email', "Enter a valid Email").isEmail(),
    body('password', "Password can't be blank").exists()
], async (req, res) => {
    // Requiring the models
    const { Bloger } = allModels;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ login: false, error: "Please try to log in with the correct credentials" });
    }
    // Capturing the email and the password from the request body
    const { email, password } = req.body;

    try {
        // Checking if a bloger with the provided email exists
        let bloger = await Bloger.findOne({ email });
        if (!bloger) {
            return res.status(400).json({ login: false, error: "Please try to log in with the correct credentials" });
        }
        // Comparing the provided password with the stored hashed password
        const passwordcompare = await bcrypt.compare(password, bloger.password);
        // Checking that the password matches
        if (!passwordcompare) {
            return res.status(400).json({ login: false, error: "Please try to log in with the correct credentials" });
        }
        // Creating an auth token with the bloger's ID
        const data = {
            bloger: {
                id: bloger.id
            }
        };
        // Sending the auth token with the sign-in response
        const authtoken = jwt.sign(data, Jwt_secret);
        res.json({ login: true, authtoken: authtoken });
    } catch (error) {
        // Handling server error if something goes wrong
        res.status(500).send({ login: false, error: "Some Error occurred" });
    }
});

// Get bloger information
router.get('/get-bloger', fetchbloger, async (req, res) => {
    try {
        // Middleware 'fetchbloger' is used to extract the ID from the auth token
        const { Bloger } = allModels;
        let blogerid = req.bloger.id;
        // Find the bloger by their ID and exclude the password from the response
        const bloger = await Bloger.findById(blogerid).select("-password");
        res.send({ status: true, bloger });
    } catch (error) {
        // Handling server error if something goes wrong
        res.status(500).send({ status: false, error: "Some Error occurred" });
    }
});

// Route to update the bloger's information
router.put("/update-bloger", fetchbloger, async (req, res) => {
    try {
        const { Bloger } = allModels;
        let blogerid = req.bloger.id;
        console.log(blogerid, "bloger id");
        console.log(req.body, "body of request");

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        // Creating the 'bodyData' from the request and accepting changes
        const bodyData = {
            image: req.body.image,
            name: req.body.name,
            gitHub: req.body.gitHub,
            programmingLanguage: req.body.programmingLanguage,
            password: hashedPassword,
        };
        // Finding and updating the bloger's information
        const bloger = await Bloger.findByIdAndUpdate(blogerid, bodyData);
        // Finding the updated bloger
        const newBloger = await Bloger.findById(blogerid);
        if (bloger) {
            // Sending a success response with the updated bloger's data
            res.status(200).send({ update: true, newBloger });
        } else {
            // Handling server error if the update fails
            res.status(500).send({ update: false, data: "Some error occurred" });
        }
    } catch (error) {
        // Handling server error if something goes wrong
        res.status(500).send({ update: false, data: "Some error occurred" });
    }
});

module.exports = router;
