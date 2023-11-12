// Import the 'mongoose' library, which is used to work with MongoDB
const mongoose = require('mongoose');

// Import the 'Schema' object from 'mongoose'
const { Schema } = mongoose;

// Import the 'commentSchema' from the 'Comments' module
const commentSchema = require('./Comments');

// Define a Mongoose schema for 'likeSchema'
const likeSchema = mongoose.Schema({
    // Define a field 'userid' which is an ObjectId referencing 'User' and is required
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This field references the 'User' model
        required: true
    }
});

// Define a Mongoose schema for 'Blogs'
const Blogs = new Schema({
    // Define a field 'title' for the blog's title, which is required
    title: {
        type: String,
        required: true
    },
    // Define a field 'programmingLanguage' for the programming language used in the blog, which is required
    programmingLanguage: {
        type: String,
        required: true
    },
    // Define a field 'description' for the blog's description, which is required
    description: {
        type: String,
        required: true
    },
    // Define a field 'image' for the blog's image
    image: {
        type: String
    },
    // Define a field 'hashtags' for the blog's hashtags, represented as an array of strings
    hashtags: {
        type: [String]
    },
    // Define a field 'comments' for the blog's comments, represented as an array of the 'commentSchema'
    comments: {
        type: [commentSchema]
    },
    // Define a field 'authorName' for the blog's author name, which is required
    authorName: {
        type: String,
        required: true
    },
    // Define a field 'likes' for the blog's likes, represented as an array (data structure for likes may need modification)
    likes: {
        type: []
    },
    // Define a field 'blogerid' which is an ObjectId referencing 'Bloger' and is required
    blogerid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bloger', // This field references the 'Bloger' model
        required: true
    },
    // Define a field 'approved' for blog approval status with a default value
    approved: {
        type: Boolean,
        default: false
    },
    // Define a field 'date' for the blog's creation date with a default value
    date: {
        type: Date,
        default: Date.now
    }
});

// Export the 'Blogs' schema for use in other parts of the application
module.exports = Blogs;
