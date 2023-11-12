const mongoose = require('mongoose')
const CommentSchema = new mongoose.Schema({
     userid: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
     },
     comment: {
          type: String,
          required: true,
     },
     date: {
          type: Date,
          default: Date.now
     },
})
module.exports = CommentSchema