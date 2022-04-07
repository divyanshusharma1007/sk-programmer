const mongoose = require('mongoose')
const Bloger = mongoose.model('Bloger', require('./Schemas/CreateBloger'))

console.log(Bloger)
module.exports = { Bloger };
