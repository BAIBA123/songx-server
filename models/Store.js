const mongoose = require('mongoose')

const schema = mongoose.Schema({
  name: { type: String },
  link: { type: String },
  pic: { type: String },
  star: { type: Number },
  start_date: { type: Date },
  keyword: { type: String }
})

module.exports = mongoose.model('Store', schema)
