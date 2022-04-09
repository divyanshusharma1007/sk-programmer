const mongoose = require('mongoose')
const Bloger = mongoose.model('Bloger', require('./Schemas/CreateBloger'))
const User = mongoose.model('User', require('./Schemas/CreateUser'))

module.exports = { Bloger, User };
