// Import the 'mongoose' library, which is used to work with MongoDB
const mongoose = require('mongoose');

// Define a Mongoose schema for 'createBloger'
const Bloger = new mongoose.Schema({
    // Define a field 'image' for the bloger's profile image with a default value
    image: {
        type: String,
        default: "defaultimage.webp"
    },
    // Define a field 'name' for the bloger's name, which is required and has a default value
    name: {
        type: String,
        required: true,
        default: 'sk-programmer'
    },
    // Define a field 'email' for the bloger's email address, which is required and must be unique
    email: {
        type: String,
        required: true,
        unique: true
    },
    // Define a field 'contactNumber' for the bloger's contact number, which is required and must be unique
    contactNumber: {
        type: String,
        required: true,
        unique: true
    },
    // Define a field 'gitHub' for the bloger's GitHub username, which is required
    gitHub: {
        type: String,
        required: true
    },
    // Define a field 'programmingLanguage' for the bloger's preferred programming language
    programmingLanguage: {
        type: String
    },
    // Define a field 'password' for the bloger's password, which is required
    password: {
        type: String,
        required: true
    }
});

// Export the 'createBloger' schema for use in other parts of the application
module.exports = Bloger;
