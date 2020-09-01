module.exports = (app) => {
  const express = require('express')
  const Book = require('../../models/Book')
  const Tag = require('../../models/Tag')
  const Note = require('../../models/Note')
  const Pic = require('../../models/Pic')
  const Post = require('../../models/Post')
  const Store = require('../../models/Store')
  const Comment = require('../../models/Comment')
  const router = express.Router({ mergeParams: true })

  // 获取列表 菜单 && 友链
  router.get('/', async (req, res) => {
    let findOptions = {}
    if (req.Model.modelName === 'Note') {
      findOptions = { book_id: req.query.book_id }
    }
    if (req.Model.modelName === 'Comment') {
      findOptions = { postId: req.query.postId }
    }
    const items = await req.Model.find(findOptions)
    res.send(items)
  })

  // 获取单个
  router.get('/:id', async (req, res) => {
    if (req.Model.modelName === 'Post') {
      const item = await req.Model.findById(req.params.id)
      const date = await req.Model.findById(req.params.id, 'date')
      const before = await req.Model.find({ date: { $gt: date.date } }).limit(1)
      const next = await req.Model.find({ date: { $lt: date.date } }).sort('-date').limit(1)
      res.send({ before, next, item })
    }
    const item = await req.Model.findById(req.params.id)
    res.send({ item })
  })

  // restful api next 中间件
  app.use(
    '/frontend/rest/:resource',
    async (req, res, next) => {
      const modelName = require('inflection').classify(req.params.resource)
      req.Model = require(`../../models/${modelName}`)
      next()
    },
    router
  )

  app.get('/frontend/api/book', async (req, res) => {
    const pageNo = parseInt(req.query.pageNo)
    const pageSize = parseInt(req.query.pageSize || 8)

    const items = await Book.find()
      .sort('-start_date')
      .setOptions({ populate: 'tags' })
      .skip((pageNo - 1) * pageSize)
      .limit(pageSize)
    const total = await Book.find().count()
    const readed = await Book.find({ status: 1 }).count()
    const recommend = await Book.find({ status: 2 }).count()
    const num = [total, readed, recommend]

    res.send({ num, items })
  })

  app.get('/frontend/api/post', async (req, res) => {
    const pageNo = parseInt(req.query.pageNo)
    const pageSize = parseInt(req.query.pageSize || 8)

    const items = await Post.find()
      .sort('-date')
      .setOptions({ populate: 'tags' })
      .skip((pageNo - 1) * pageSize)
      .limit(pageSize)
    const total = await Post.find().count()
    res.send({ total, items })
  })

  app.get('/frontend/api/note', async (req, res) => {
    const total = await Note.find().count()
    const no = Math.ceil(Math.random() * total)
    const item = await Note.findOne()
      .setOptions({ populate: 'book_id' })
      .skip(no - 1)
    res.send(item)
  })

  app.get('/frontend/api/home', async (req, res) => {
    const mainPic = await Pic.find()
    const read = {
      en: 'read',
      zh: '阅读',
      num: await Book.find().count(),
      list: await Book.find().sort('-start_date').limit(5)
    }
    const post = {
      en: 'post',
      zh: '随笔',
      num: await Post.find().count(),
      list: await Post.find().sort('-date').limit(5)
    }
    const store = {
      en: 'store',
      zh: '收藏',
      num: await Store.find().count(),
      list: await Store.find().sort('-start_date').limit(5)
    }
    res.send({
      mainPic,
      updates: [read, post, store]
    })
  })

  // 评论
  app.post('/frontend/api/comment', async (req, res) => {
    const model = await Comment.create(req.body)
    res.send({ model })
  })

  app.get('/test', async (req, res) => {
    console.log('yes')
  })
}
