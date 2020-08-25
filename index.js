const express = require('express')
const app = express()

app.use(express.json())
app.use(require('cors')())
app.use('/uploads', express.static(__dirname + '/uploads'))

require('./routes/backend/index')(app)
require('./routes/frontend/index')(app)
require('./db')(app)

app.listen(9876, () => {
  console.log('============== server start at prot: 9876 ==============')
})
