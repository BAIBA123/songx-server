const mongoose = require('mongoose')

const schema = mongoose.Schema({
  date: { type: Date },
  content: { type: String },
  book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }
})

module.exports = mongoose.model('Note', schema)
