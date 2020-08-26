module.exports = (app) => {
  const express = require('express')
  const Book = require('../../models/Book')
  const Tag = require('../../models/Tag')
  const Note = require('../../models/Note')
  const Pic = require('../../models/Pic')
  const Post = require('../../models/Post')
  const Store = require('../../models/Store')
  const router = express.Router({ mergeParams: true })

  // 获取列表 菜单 && 友链
  router.get('/', async (req, res) => {
    let findOptions = {}
    if (req.Model.modelName === 'Note') {
      findOptions = { book_id: req.query.book_id }
    }
    const items = await req.Model.find(findOptions)
    res.send(items)
  })

  // 获取单个
  router.get('/:id', async (req, res) => {
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
    res.send({ total, items })
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

  app.get('/test', async (req, res) => {
    res.send({ flag: false })
  })
}
