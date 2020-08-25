const mongoose = require('mongoose')

const schema = mongoose.Schema({
  name: { type: String },
  author: { type: String },
  pic: { type: String },
  star: { type: Number },
  start_date: { type: Date },
  end_date: { type: Date },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }]
})

module.exports = mongoose.model('Book', schema)
