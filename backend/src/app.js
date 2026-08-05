import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import { env } from './config/env.js'
import { mongoSanitizeMiddleware, xssCleanMiddleware } from './middleware/sanitize.middleware.js'
import { globalLimiter } from './middleware/rateLimiter.middleware.js'
import notFound from './middleware/notFound.middleware.js'
import errorHandler from './middleware/error.middleware.js'
import routesV1 from './routes/v1/index.js'
import seoRoutes from './routes/v1/seo.routes.js'

const app = express()

// Trust the first proxy (needed on Render/Railway/Heroku/behind Nginx)
// so secure cookies and rate-limit IPs work correctly.
app.set('trust proxy', 1)

// ---- Security ----
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
)

const allowedOrigins = [env.CLIENT_URL, env.ADMIN_URL].filter(Boolean)
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  })
)

// ---- Body parsing ----
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true, limit: '2mb' }))
app.use(cookieParser(env.COOKIE_SECRET))

// ---- Sanitization (Express-5-safe: mutates in place, never reassigns req.query) ----
app.use(mongoSanitizeMiddleware) // strips $ and . operators from user input (NoSQL injection)
app.use(xssCleanMiddleware) // strips malicious HTML/script from input (XSS)

// ---- Performance ----
app.use(compression())

// ---- Logging ----
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'))
}

// ---- Rate limiting (applied to all /api routes) ----
app.use('/api', globalLimiter)

// ---- Health check ----
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'OK', timestamp: new Date().toISOString() })
})

// ---- SEO: served at the API's own root so a reverse proxy can map
// yoursite.com/sitemap.xml -> this backend directly if desired ----
app.use('/', seoRoutes)

// ---- API routes ----
app.use(`/api/${env.API_VERSION}`, routesV1)

// ---- 404 + error handler ----
app.use(notFound)
app.use(errorHandler)

export default app
