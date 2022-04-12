const express = require('express')
const router = express.Router()
const allModels = require('../Databases/allModels')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const Jwt_secrtet = "sk-programmer"
const jwt = require('jsonwebtoken')
const fetchAuthority = require('../middlewares/fetchAuthority')

router.post('/create',
     // using the express validator as the middleware for creating the Authoritye
     [
          body("name", "Enter a valid name").isLength({ min: 5, max: 20 }),
          body("email", "Enter a valid email").isEmail(),
          body("password", "Enter a password").isLength({ min: 6 }),
          body("contactNumber", "your number is not valid").isLength({ min: 10, max: 10 }),
     ],
     async (req, res) => {
          // requiring modules form the module
          const { Authority, Bloger, User } = allModels;
          // validating the module
          const errors = validationResult(req);

          // checkin the validation
          if (!errors.isEmpty()) {
               return res.status(400).json({ errors: errors.array() });
          }

          else {
               try {
                    // checking that the the Authority exists or not
                    let authority = await Authority.findOne({ email: req.body.email }, { contactNumber: req.body.contactNumber });
                    let auth2 = await Bloger.findOne({ email: req.body.email }, { contactNumber: req.body.contactNumber });
                    let auth = await User.findOne({ email: req.body.email }, { contactNumber: req.body.contactNumber });
                    if (authority) {
                         return res.status(400).json({ status: false, error: "You already exists" })
                    }
                    const salt = await bcrypt.genSalt(12);
                    const secondrypassword = await bcrypt.hash(req.body.password, salt);
                    // converting the body data into the saving data
                    const bodyData = {
                         image: req.body.image,
                         name: req.body.name,
                         email: req.body.email,
                         contactNumber: req.body.contactNumber,
                         password: secondrypassword,
                    }
                    // saving the data
                    authority = await Authority.create(bodyData);
                    console.log(authority, "authority create ")
                    // making the id
                    const data = {
                         authority: {
                              id: authority.id
                         }
                    }
                    const authtoken = jwt.sign(data, Jwt_secrtet)
                    res.json({ login: true, authtoken: authtoken })
               } catch (err) {
                    // sending errors 
                    res.status(500).send({ login: false, error: "Some Error occured" })
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
          const { Authority, Bloger, User } = allModels;


          const errors = validationResult(req)
          if (!errors.isEmpty()) {
               return res.status(400).json({ login: false, error: "Please try to log in with the correct creditianatials" })
          }
          // capturing the email and the password from the body
          const { email, password } = req.body;

          try {

               let authority = await Authority.findOne({ email })
               if (!authority) {
                    return res.status(400).json({ login: false, error: "Please try to log in with the correct creditianatials" })
               }
               // compaing the password password with the decrypt password

               const passwordcompare = await bcrypt.compare(password, authority.password);
               // checking that the password is created or not
               if (!passwordcompare) {
                    return res.status(400).json({ login: false, error: "Please try to log in with the correct creditianatials" })
               }
               // creating the auth token with the id of Authority
               const data = {
                    authority: {
                         id: authority.id
                    }
               }

               // sending the auth token with sign in 
               const authtoken = jwt.sign(data, Jwt_secrtet)
               res.json({ login: true, authtoken })
          } catch (error) {
               console.log(error)
               res.status(500).send({ login: false, error: "Some Error occured" })
          }
     }

)

// get Authority information 



router.post('/getauthority', fetchAuthority, async (req, res) => {
     try {
          // fetch user is a middleware which is used to take the id form the authtoken
          const { Authority } = allModels;
          let Authorityid = req.authority.id;
          const authority = await Authority.findById(Authorityid).select("-password")
          res.send({ status: true, authority })
     } catch (error) {

          res.status(500).send({ status: false, error: "Some Error occured" })
     }
})

module.exports = router;