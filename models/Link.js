const mongoose = require('mongoose')

const schema = mongoose.Schema({
  name: { type: String },
  pic: { type: String },
  link: { type: String }
})

module.exports = mongoose.model('Link', schema)
