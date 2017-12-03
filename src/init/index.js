import mongoose from 'mongoose'


export const gracefulExit = () => mongoose.connection.close(() => new Error('Mongoose connection closed'))

export const describeProcessEvents = (mongoURL) => {
  process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit)

  process.on('uncaughtException', (err) => {
    console.info('uncaughtException', err)
    process.exit(1)
  })

  process.on('unhandledRejection', (reason, p) => {
    console.info('Unhandled Rejection at:', p, 'reason:', reason)
    process.exit(1)
  })

  mongoose.connection.on('error', (err) => {
    console.info(`Failed to connect to DB ${mongoURL} on startup`, err)
  })

  mongoose.connection.on('disconnected', () => {
    console.info(`Mongoose default connection to DB : ${mongoURL} disconnected`)
  })
}
