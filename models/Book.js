const mongoose = require('mongoose')

const schema = mongoose.Schema({
  name: { type: String },
  author: { type: String },
  pic: { type: String },
  star: { type: Number },
  start_date: { type: Date },
  end_date: { type: Date },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  status: { type: Number }, // 0:已购；1:已读；2:推荐
  publish: { type: String } // 出版信息
})

module.exports = mongoose.model('Book', schema)
