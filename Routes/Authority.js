const express = require('express');
const router = express.Router();
const allModels = require('../Databases/allModels');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Jwt_secret = process.env.Jwt_secret; // Typo: Jwt_secret should be Jwt_secret (or Jwt_secret should be corrected wherever it's used).
const jwt = require('jsonwebtoken');
const fetchAuthority = require('../middlewares/fetchAuthority');


// Route to create a new Authority
router.post('/create-authority',
    // Using Express Validator as a middleware for creating the Authority
    [
        body("name", "Enter a valid name").isLength({ min: 5, max: 20 }),
        body("email", "Enter a valid email").isEmail(),
        body("password", "Enter a password").isLength({ min: 6 }),
        body("contactNumber", "Your number is not valid").isLength({ min: 10, max: 10 }),
    ],
    async (req, res) => {
        // Requiring modules from the 'allModels' module
        const { Authority, Bloger, User } = allModels;
        // Validating the request body
        if(Authority.find().count>1)return res.status(400).json({error:"one authority already exists"})
        const errors = validationResult(req);

        // Checking the validation results
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } else {
            try {
                // Checking if the Authority already exists in Authority, Bloger, or User collections
                let authority = await Authority.findOne({ email: req.body.email }, { contactNumber: req.body.contactNumber });
                let auth2 = await Bloger.findOne({ email: req.body.email }, { contactNumber: req.body.contactNumber });
                let auth = await User.findOne({ email: req.body.email }, { contactNumber: req.body.contactNumber });
                if (authority) {
                    return res.status(400).json({ status: false, error: "You already exist" });
                }
                // Hashing the password for security
                const salt = await bcrypt.genSalt(12);
                const secondrypassword = await bcrypt.hash(req.body.password, salt);
                // Converting the request data into the format for saving
                const bodyData = {
                    image: req.body.image,
                    name: req.body.name,
                    email: req.body.email,
                    contactNumber: req.body.contactNumber,
                    password: secondrypassword,
                };
                // Saving the data to create a new Authority
                authority = await Authority.create(bodyData);
                console.log(authority, "authority create");
                // Creating an auth token with the Authority's ID
                const data = {
                    authority: {
                        id: authority.id
                    }
                };
                const authtoken = jwt.sign(data, Jwt_secret);
                res.json({ login: true, authtoken: authtoken });
            } catch (err) {
                // Handling server error if something goes wrong
                res.status(500).send({ login: false, error: "Some Error occurred" });
            }
        }
    }
);

// Login route
router.post('/login', [
    // Request body validation using Express Validator
    body('email', "Enter a valid Email").isEmail(),
    body('password', "Password can't be blank").exists()
], async (req, res) => {
    // Requiring the models
    const { Authority, Bloger, User } = allModels;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ login: false, error: "Please try to log in with the correct credentials" });
    }
    // Capturing the email and the password from the request body
    const { email, password } = req.body;

    try {
        // Checking if an Authority with the provided email exists in any of the collections
        let authority = await Authority.findOne({ email });
        if (!authority) {
            return res.status(400).json({ login: false, error: "Please try to log in with the correct credentials" });
        }
        // Comparing the provided password with the stored hashed password
        const passwordcompare = await bcrypt.compare(password, authority.password);
        // Checking that the password matches
        if (!passwordcompare) {
            return res.status(400).json({ login: false, error: "Please try to log in with the correct credentials" });
        }
        // Creating an auth token with the Authority's ID
        const data = {
            authority: {
                id: authority.id
            }
        };
        // Sending the auth token with the sign-in response
        const authtoken = jwt.sign(data, Jwt_secret);
        res.json({ login: true, authtoken });
    } catch (error) {
        console.log(error);
        // Handling server error if something goes wrong
        res.status(500).send({ login: false, error: "Some Error occurred" });
    }
});

// Get Authority information
router.get('/fetch-authority', fetchAuthority, async (req, res) => {
    try {
        // Middleware 'fetchAuthority' is used to extract the ID from the auth token
        const { Authority } = allModels;
        let Authorityid = req.authority.id;
        // Find the Authority by their ID and exclude the password from the response
        const authority = await Authority.findById(Authorityid).select("-password");
        res.send({ status: true, authority });
    } catch (error) {
        // Handling server error if something goes wrong
        res.status(500).send({ status: false, error: "Some Error occurred" });
    }
});

module.exports = router;
