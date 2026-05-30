import { config as dotenvConfig } from 'dotenv'
import app from './api/index'

process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...')
  console.error(err.name, err.message)
  console.error(err)
  process.exit(1)
})

dotenvConfig()

const port = process.env.PORT || 5000
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`)
  console.log(`Environment: ${process.env.NODE_ENV}`)
})

process.on('unhandledRejection', (reason: any) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...')
  console.error(reason)
  server.close(() => {
    process.exit(1)
  })
})

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully')
  server.close(() => {
    console.log('💥 Process terminated!')
  })
})
