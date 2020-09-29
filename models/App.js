const mongoose = require('mongoose')

const schema = mongoose.Schema({
  name: { type: String },
  link: { type: String },
  desc: { type: String },
  pic: { type: String },
  start_date: { type: Date }
})

module.exports = mongoose.model('App', schema)
