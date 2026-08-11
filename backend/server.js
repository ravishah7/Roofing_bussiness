import { env } from './src/config/env.js'
import connectDB from './src/config/db.js'
import app from './src/app.js'

let server

async function start() {
  await connectDB()
  server = app.listen(env.PORT, () => {
    console.log(`[server] Roofing CMS API running in ${env.NODE_ENV} mode on port ${env.PORT}`)
    console.log(`[server] API base: http://localhost:${env.PORT}/api/${env.API_VERSION}`)
  })
}

start()

process.on('unhandledRejection', (err) => {
  console.error('[warning] Unhandled Rejection (server staying up):', err)
})

process.on('uncaughtException', (err) => {
  console.error('[fatal] Uncaught Exception:', err)
  process.exit(1)
})

;['SIGTERM', 'SIGINT'].forEach((signal) => {
  process.on(signal, () => {
    console.log(`[server] ${signal} received, shutting down gracefully`)
    server?.close(() => process.exit(0))
  })
})
