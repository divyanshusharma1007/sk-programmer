const express = require('express')
const router = express.Router()
const allModels = require('../Databases/allModels')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const Jwt_secrtet = "sk-programmer"
const jwt = require('jsonwebtoken')

router.post('/createbloger', [
     body("name", "Enter a valid name").isLength({ min: 5, max: 20 }),
     body("email", "Enter a valid email").isEmail(),
     body("password", "Enter a password").isLength({ min: 6 }),
     body("contactNumber", "your number is not valid").isLength({ min: 10, max: 10 }),
], async (req, res) => {
     // requiring modules form the module
     const { Bloger } = allModels;
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
     }
     else {
          try {
               let bloger = await Bloger.findOne({ email: req.body.email }, { contactNumber: req.body.contactNumber });
               if (bloger) {
                    return res.status(400).json({ error: "bloger already exists" })
               }
               const salt = await bcrypt.genSalt(12);
               const secondrypassword = await bcrypt.hash(req.body.password, salt);
               const bodyData = {
                    name: req.body.name,
                    email: req.body.email,
                    contactNumber: req.body.contactNumber,
                    gitHub: req.body.gitHub,
                    programmingLanguage: req.body.programmingLanguage,
                    password: secondrypassword,
               }
               bloger = await Bloger.create(bodyData);
               const data = {
                    bloger: {
                         id: bloger.id
                    }
               }
               const authtoken = jwt.sign(data, Jwt_secrtet)
               res.json({ authtoken: authtoken })
          } catch (err) {
               console.log(err.message, err)
               res.status(500).send("Some Error occured")
          }
     }
})
module.exports = router;