const mongoose = require('mongoose')

const schema = mongoose.Schema({
  name: { type: String },
  pic: { type: String },
  date: { type: Date },
  content: { type: String },
  status: { type: Boolean }
})

module.exports = mongoose.model('Post', schema)
