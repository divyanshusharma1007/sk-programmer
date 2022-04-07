const express = require('express')
const router = express.Router()
const allModels = require('../Databases/allModels')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const Jwt_secrtet = "sk-programmer"
const jwt = require('jsonwebtoken')

router.post('/createbloger',
     // using the express validator as the middleware for creating the blogere
     [
          body("name", "Enter a valid name").isLength({ min: 5, max: 20 }),
          body("email", "Enter a valid email").isEmail(),
          body("password", "Enter a password").isLength({ min: 6 }),
          body("contactNumber", "your number is not valid").isLength({ min: 10, max: 10 }),
     ],
     //function to manage the request and response
     async (req, res) => {
          // requiring modules form the module
          const { Bloger } = allModels;
          // validating the module
          const errors = validationResult(req);

          // checkin the validation
          if (!errors.isEmpty()) {
               return res.status(400).json({ errors: errors.array() });
          }

          else {
               try {
                    // checking that the the bloger exists or not
                    let bloger = await Bloger.findOne({ email: req.body.email }, { contactNumber: req.body.contactNumber });
                    if (bloger) {
                         return res.status(400).json({ error: "bloger already exists" })
                    }
                    const salt = await bcrypt.genSalt(12);
                    const secondrypassword = await bcrypt.hash(req.body.password, salt);
                    // converting the body data into the saving data
                    const bodyData = {
                         name: req.body.name,
                         email: req.body.email,
                         contactNumber: req.body.contactNumber,
                         gitHub: req.body.gitHub,
                         programmingLanguage: req.body.programmingLanguage,
                         password: secondrypassword,
                    }
                    // saving the data
                    bloger = await Bloger.create(bodyData);
                    // making the id
                    const data = {
                         bloger: {
                              id: bloger.id
                         }
                    }
                    const authtoken = jwt.sign(data, Jwt_secrtet)
                    res.json({ authtoken: authtoken })
               } catch (err) {
                    // sending errors 
                    res.status(500).send("Some Error occured")
               }
          }
     })

// login routes
router.post('/login',
     [
          body('email', "Enter a valid Email").isEmail(),
          body('password', "Password can't be blank").exists()
     ],

     async (req, res) => {
          // requiring the models
          const { Bloger } = allModels;


          const errors = validationResult(req)
          if (!errors.isEmpty()) {
               return res.status(400).json({ errors: errors.array() });
          }
          // capturing the email and the password from the body
          const { email, password } = req.body;

          try {

               let bloger = await Bloger.findOne({ email })
               if (!bloger) {
                    return res.status(400).json({ error: "Please try to log in with the correct creditianatials" })
               }
               // compaing the password password with the decrypt password

               const passwordcompare = await bcrypt.compare(password, bloger.password);
               // checking that the password is created or not
               if (!passwordcompare) {
                    return res.status(400).json({ error: "Please try to log in with the correct creditianatials" })
               }
               // creating the auth token with the id of bloger
               const data = {
                    bloger: {
                         id: bloger.id
                    }
               }

               // sending the auth token with sign in 
               const authtoken = jwt.sign(data, Jwt_secrtet)
               res.json({ authtoken })
          } catch (error) {
               res.status(500).send("Some Error occured")
          }
     })



module.exports = router;