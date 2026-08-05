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

// ---- Graceful shutdown & crash safety ----
//
// unhandledRejection is intentionally NON-fatal here. Request-level errors
// (including failed Cloudinary uploads, DB errors, etc.) are already
// caught and turned into proper HTTP responses by asyncHandler + the
// Express error middleware — those never reach this handler at all.
// What DOES reach here is a stray rejected promise with no .catch()
// anywhere in the chain, which can originate from deep inside a
// third-party SDK's own internals (e.g. Cloudinary's client) on a code
// path we don't control and can't attach a listener to directly.
// Killing the whole server over one such stray rejection — while every
// other request keeps working fine — does more harm than good, so this
// logs it loudly (so it's never silently ignored) without taking down
// every other in-flight request and admin session.
//
// uncaughtException stays fatal: that's a *synchronous* error that
// escaped everywhere, which usually means genuinely corrupted state —
// continuing to run risks worse problems than restarting.
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
