const mongoose = require('mongoose')

const schema = mongoose.Schema({
  name: { type: String },
  link: { type: String }
})

module.exports = mongoose.model('Menu', schema)
