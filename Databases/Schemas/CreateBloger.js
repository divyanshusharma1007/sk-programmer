const mongoose = require('mongoose')
const createBloger = new mongoose.Schema({
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
     gitHub: {
          type: String,
          required: true
     },
     programmingLanguage: {
          type: String,
     },
     password: {
          type: String,
          required: true
     }

})

module.exports = createBloger