import dotenv from 'dotenv'
dotenv.config()

const required = ['MONGO_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET']

// Fail fast in production if critical secrets are missing.
if (process.env.NODE_ENV === 'production') {
  const missing = required.filter((key) => !process.env[key])
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  API_VERSION: process.env.API_VERSION || 'v1',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  ADMIN_URL: process.env.ADMIN_URL || 'http://localhost:5174',

  MONGO_URI: process.env.MONGO_URI,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  JWT_EMAIL_SECRET: process.env.JWT_EMAIL_SECRET || process.env.JWT_ACCESS_SECRET,
  JWT_RESET_SECRET: process.env.JWT_RESET_SECRET || process.env.JWT_ACCESS_SECRET,

  COOKIE_SECRET: process.env.COOKIE_SECRET || 'dev_cookie_secret',

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: Number(process.env.SMTP_PORT) || 465,
  SMTP_SECURE: process.env.SMTP_SECURE !== 'false',
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM_NAME: process.env.SMTP_FROM_NAME || 'Roofing CMS',
  SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
  CONTACT_NOTIFY_EMAIL: process.env.CONTACT_NOTIFY_EMAIL,

  RATE_LIMIT_WINDOW_MINUTES: Number(process.env.RATE_LIMIT_WINDOW_MINUTES) || 15,
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX) || 300,
  AUTH_RATE_LIMIT_MAX: Number(process.env.AUTH_RATE_LIMIT_MAX) || 10,

  SUPER_ADMIN_NAME: process.env.SUPER_ADMIN_NAME || 'Site Owner',
  SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
}
