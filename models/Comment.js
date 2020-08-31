const mongoose = require('mongoose')

const schema = mongoose.Schema({
  name: { type: String },
  email: { type: String },
  date: { type: Date, default: Date.now },
  content: { type: String },
  postId: { type: String }
})

module.exports = mongoose.model('Comment', schema)
