const mongoose = require('mongoose')
const Authority = new mongoose.Schema({
     image: {
          type: String,
          default: "defaultimage.webp"
     },
     name: {
          type: String,
          required: true,
          default: 'sk-programmer'
     },
     email: {
          type: String,
          required: true,
          unique: true
     },
     contactNumber: {
          type: String,
          required: true,
          unique: true
     },
     password: {
          type: String,
          required: true
     }

})

module.exports = Authority