const mongoose = require('mongoose')

const schema = mongoose.Schema({
  pic: { type: String },
  status: { type: Boolean },
  title: { type: String }
})

module.exports = mongoose.model('Pic', schema)
