module.exports = (app) => {
  const express = require('express')
  const router = express.Router({ mergeParams: true })

  // 获取列表
  router.get('/', async (req, res) => {
    let findOptions = {}
    const queryOptions = {}
    if (['Book', 'Store'].includes(req.Model.modelName)) {
      queryOptions.populate = 'tags'
    }

    if (req.Model.modelName === 'Note') {
      findOptions = { book_id: req.query.book_id }
    }

    const pageNo = parseInt(req.query.pageNo) || 1
    const pageSize = parseInt(req.query.pageSize) || 10
    const items = await req.Model.find(findOptions).setOptions(queryOptions).skip((pageNo - 1) * pageSize).limit(pageSize)
    const total = await req.Model.find().count()
    res.send({ items, total })
  })

  // 添加
  router.post('/', async (req, res) => {
    const model = await req.Model.create(req.body)
    res.send(model)
  })

  // 编辑
  router.put('/:id', async (req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
    res.send(model)
  })

  // 删除
  router.delete('/:id', async (req, res) => {
    await req.Model.findByIdAndDelete(req.params.id)
    res.send({
      success: true,
      msg: '删除成功!!!'
    })
  })

  // 获取单个
  router.get('/:id', async (req, res) => {
    const item = await req.Model.findById(req.params.id)
    res.send({
      item
    })
  })

  // restful api next 中间件
  app.use('/backend/rest/:resource', async (req, res, next) => {
    const modelName = require('inflection').classify(req.params.resource)
    req.Model = require(`../../models/${modelName}`)
    next()
  }, router)

  // 文件上传
  const multer = require('multer')
  const upload = multer({ dest: __dirname + '/../../uploads' })

  app.post('/backend/api/uploads', upload.single('file'), async (req, res) => {
    const { file } = req
    // const url = `http://127.0.0.1:9876/uploads/${file.filename}`
    // const url = `http://127.0.0.1:9876/uploads/${file.filename}`
    const url = process.env.MODE_ENV === 'development' ? `http://127.0.0.1:9876/uploads/${file.filename}` : `http://114.55.242.15:9876/uploads/${file.filename}`
    res.send({ url, errno: 0 })
  })
}
