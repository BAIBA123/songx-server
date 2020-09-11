module.exports = (app) => {
  const path = require('path')
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
    const items = await req.Model.find(findOptions).sort('-start_date').sort('-date').setOptions(queryOptions).skip((pageNo - 1) * pageSize).limit(pageSize)
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

  // const multer = require('multer')
  // var storage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     // cb(null, __dirname + '/../../uploads')
  //     cb(null, path.join(__dirname, '/../../uploads'))
  //   },
  //   filename: function (req, file, cb) {
  //     cb(null, file.originalname)
  //   }
  // })
  // const upload = multer({ storage })

  // app.post('/backend/api/uploads', upload.single('file'), async (req, res) => {
  //   const { file } = req

  //   // 调用tinyPNG接口压缩图片
  //   const filePath = path.join(__dirname, '/../../uploads/', file.originalname)
  //   const tinify = require('tinify')
  //   tinify.key = 'dJr1j45YnhfqQ177JZwcvMqxzPHZkpgC'
  //   tinify.fromFile(filePath).toFile(filePath, function (err) {
  //     if (err instanceof tinify.AccountError) {
  //       console.log('The error message is 1: ' + err.message)
  //     } else if (err instanceof tinify.ClientError) {
  //       console.log('The error message is 2: ' + err.message)
  //     } else if (err instanceof tinify.ServerError) {
  //       console.log('The error message is 3: ' + err.message)
  //     } else if (err instanceof tinify.ConnectionError) {
  //       console.log('The error message is 4: ' + err.message)
  //     } else {
  //       console.log('success')
  //     }
  //   })
  //   const url = process.env.MODE_ENV === 'development' ? `http://127.0.0.1:9876/uploads/${file.filename}` : `http://114.55.242.15:9876/uploads/${file.filename}`
  //   res.send({ url, errno: 0 })
  // })

  // tinyPNG压缩图片，上传到oss =================================================
  const multer = require('multer')
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '/../../uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  const upload = multer({ storage })

  const OSS = require('ali-oss')
  const client = new OSS({
    accessKeyId: 'LTAI4G9NAvd7dtBrJaktPQiD',
    accessKeySecret: 'i3C4LTKJyoysglKFB4f38TmAo1uTPP',
    bucket: 'blackali',
    region: 'oss-cn-hangzhou'
  })
  client.useBucket('blackali')

  async function put (name, localFile) {
    try {
      const data = await client.put(name, localFile)
      return data.url
    } catch (err) {
      console.log(err)
    }
  }

  // 1.上传文件到服务器，2.调用TinyPNG API压缩图片，3.上传oss
  app.post('/backend/api/uploads', upload.single('file'), async (req, res) => {
    const { file } = req
    const tinify = require('tinify')
    const filePath = path.join(__dirname, '/../../uploads/', file.originalname)

    tinify.key = 'dJr1j45YnhfqQ177JZwcvMqxzPHZkpgC'
    tinify.fromFile(filePath).toFile(filePath, async function (msg) {
      if (msg instanceof tinify.AccountError) {
        console.log('The error message is 1: ' + msg.message)
      } else if (msg instanceof tinify.ClientError) {
        console.log('The error message is 2: ' + msg.message)
      } else if (msg instanceof tinify.ServerError) {
        console.log('The error message is 3: ' + msg.message)
      } else if (msg instanceof tinify.ConnectionError) {
        console.log('The error message is 4: ' + msg.message)
      } else {
        console.log('success')
        const url = await put(file.originalname, filePath)
        res.send({ url, errno: 0 })
      }
    })
  })
}
