const jwt = require('jsonwebtoken')
const Jwt_secrtet = "sk-programmer"
fetchusers = (req, res, next) => {
     //    Get the user form ;the jwt toke and id to req and id to object 
     const token = req.header('auth-token');
     if (!token) {
          res.status(401).send({ error: "Please Authenticate using valid token" })
     }
     try {
          // this is used to verify hte user 
          const data = jwt.verify(token, Jwt_secrtet)
          req.bloger = data.bloger;
          next();
     } catch (error) {
          res.status(401).send({ error: "please authenticate using a valid token" })
     }

}
module.exports = fetchusers;