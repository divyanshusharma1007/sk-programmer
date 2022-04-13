const mongoose = require('mongoose')
const Bloger = mongoose.model('Bloger', require('./Schemas/CreateBloger'))
const User = mongoose.model('User', require('./Schemas/CreateUser'))
const Authority = mongoose.model('Authority', require('./Schemas/CreateAuthority'))
const Blogs = mongoose.model('Blogs', require('./Schemas/CreateBlogs'))
// const Authority = mongoose.model('Authority', require('./Schemas/Authority'))

module.exports = { Bloger, User, Authority, Blogs };
