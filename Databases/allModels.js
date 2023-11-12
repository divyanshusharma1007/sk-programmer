// Import the 'mongoose' library, which is used to work with MongoDB
const mongoose = require('mongoose');

// Define and create Mongoose models for different schemas and export them
// 'Bloger' model is created based on the 'CreateBloger' schema
const Bloger = mongoose.model('Bloger-sk', require('./Schemas/Bloger'));

// 'User' model is created based on the 'CreateUser' schema
const User = mongoose.model('User-skprogrammmer', require('./Schemas/User'));

// 'Authority' model is created based on the 'CreateAuthority' schema
const Authority = mongoose.model('Authority-skprogrammer', require('./Schemas/Authority'));

// 'Blogs' model is created based on the 'CreateBlogs' schema
const Blogs = mongoose.model('Blogs-skprogrammer', require('./Schemas/Blogs'));

// Export all the created models for use in other parts of the application
module.exports = { Bloger, User, Authority, Blogs };
