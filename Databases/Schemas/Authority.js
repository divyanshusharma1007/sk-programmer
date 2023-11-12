// Import the 'mongoose' library, which is used to work with MongoDB
const mongoose = require('mongoose');

// Define a Mongoose schema for 'Authority'
const Authority = new mongoose.Schema({
    // Define a field 'image' for the authority's profile image, with a default value
    image: {
        type: String,
        default: "defaultimage.webp"
    },
    // Define a field 'name' for the authority's name, which is required and has a default value
    name: {
        type: String,
        required: true,
        default: 'sk-programmer'
    },
    // Define a field 'email' for the authority's email address, which is required and must be unique
    email: {
        type: String,
        required: true,
        unique: true
    },
    // Define a field 'contactNumber' for the authority's contact number, which is required and must be unique
    contactNumber: {
        type: String,
        required: true,
        unique: true
    },
    // Define a field 'password' for the authority's password, which is required
    password: {
        type: String,
        required: true
    }
});

// Export the 'Authority' schema for use in other parts of the application
module.exports = Authority;
