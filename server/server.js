import express from 'express'
import db from './config/db'
import bodyParser from 'body-parser'
import routes from './routes'
require('./config/config')
db()
const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())

app.use('/api', routes)

app.listen(port, () => {
  console.log(`Started up at port ${port}`)
})

export default app
