import http from 'http'
import path from 'path'
import express from 'express'
import mongoose from 'mongoose'
import bluebird from 'bluebird'
import bodyParser from 'body-parser'

import router from './routes'
import { MONGO_URL, PORT } from './config'
import { describeProcessEvents } from './init'


const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view_engine', 'pug')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '../public')))

const server = http.createServer(app)
app.use('/', router.main)

global.Promise = bluebird
Promise.config({ cancellation: true })

mongoose.connection.on('connected', () => {
  server.listen(80, () => console.log('server is running'))
})

try {
  describeProcessEvents(MONGO_URL)
  mongoose.connect(MONGO_URL)
  mongoose.Promise = global.Promise
}
catch (error) {
  console.warn(error)
}