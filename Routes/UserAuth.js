const express = require('express')
const router = express.Router()
const allModels = require('../Databases/allModels')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const Jwt_secrtet = "sk-programmer"
const jwt = require('jsonwebtoken')
const fetchuser = require('../middlewares/fetchuser')

router.post('/createuser',
     // using the express validator as the middleware for creating the blogere
     [
          body("name", "Enter a valid name").isLength({ min: 5, max: 20 }),
          body("email", "Enter a valid email").isEmail(),
          body("password", "Enter a password").isLength({ min: 6 }),
          body("contactNumber", "your number is not valid").isLength({ min: 10, max: 10 }),
     ],
     async (req, res) => {
          // requiring modules form the module
          const { User, Bloger } = allModels;
          // validating the module
          const errors = validationResult(req);

          // checkin the validation
          if (!errors.isEmpty()) {
               return res.status(400).json({ errors: errors.array() });
          }

          else {
               try {
                    // checking that the the bloger exists or not
                    let user = await User.findOne({ email: req.body.email }, { contactNumber: req.body.contactNumber });
                    let userasbloger = await Bloger.findOne({ email: req.body.email })
                    if (user || userasbloger) {
                         return res.status(400).json({ status: false, error: "user already exists or exist as bloger" })
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
                    user = await User.create(bodyData);
                    // making the id
                    const data = {
                         user: {
                              id: user.id
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
          const { User } = allModels;


          const errors = validationResult(req)
          if (!errors.isEmpty()) {
               return res.status(400).json({ login: false, error: "Please try to log in with the correct creditianatials" })
          }
          // capturing the email and the password from the body
          const { email, password } = req.body;

          try {

               let user = await User.findOne({ email })
               if (!user) {
                    return res.status(400).json({ login: false, error: "Please try to log in with the correct creditianatials" })
               }
               // compaing the password password with the decrypt password

               const passwordcompare = await bcrypt.compare(password, user.password);
               // checking that the password is created or not
               if (!passwordcompare) {
                    return res.status(400).json({ login: false, error: "Please try to log in with the correct creditianatials" })
               }
               // creating the auth token with the id of bloger
               const data = {
                    user: {
                         id: user.id
                    }
               }

               // sending the auth token with sign in 
               const authtoken = jwt.sign(data, Jwt_secrtet)
               res.json({ login: true, authtoken })
          } catch (error) {
               res.status(500).send({ login: false, error: "Some Error occured" })
          }
     }

)

// get bloger information 



router.post('/getuser', fetchuser, async (req, res) => {
     try {
          const { User } = allModels;
          // fetch user is a middleware which is used to take the id form the authtoken
          let userid = req.user.id;
          const user = await User.findById(userid).select("-password")
          res.send({ status: true, user })
     } catch (error) {

          res.status(500).send({ status: false, error: "Some Error occured" })
     }
})



// route is used to update the bloger



router.post("/updateuser", fetchuser, async (req, res) => {
     try {
          const { User } = allModels;
          let userid = req.user.id;
          const salt = await bcrypt.genSalt(12);
          const secondrypassword = await bcrypt.hash(req.body.password, salt);

          // making the bodyData form the request and accepting the changes
          const bodyData = {
               image: req.body.image,
               name: req.body.name,
               password: secondrypassword,
          }
          //    this is used to find update the bloger
          const user = await User.findByIdAndUpdate(userid, bodyData);
          // this is used to find the new bloger
          const newUser = await User.findById(userid);
          if (user) {
               res.status(200).send({ update: true, newUser });
          }
          else {
               res.status(500).send({ update: false, data: "some error occured" });
          }
     } catch (error) {

          res.status(500).send({ update: false, data: "some error occured" });
     }

})

module.exports = router;