import { env } from '../config/env.js'
import ApiError from '../utils/ApiError.js'

/**
 * Central error handler. Normalizes Mongoose/JWT/Multer errors into
 * ApiError shape before responding, so clients always get a
 * consistent { success, statusCode, message, errors } payload.
 */
// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, next) {
  let error = err

  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || 500
    let message = error.message || 'Internal server error'
    let errors = []

    // Mongoose validation errors
    if (error.name === 'ValidationError') {
      statusCode = 400
      errors = Object.values(error.errors).map((e) => ({ field: e.path, message: e.message }))
      message = 'Validation failed'
    }

    // Mongoose cast errors (bad ObjectId, etc.)
    if (error.name === 'CastError') {
      statusCode = 400
      message = `Invalid value for field '${error.path}'`
    }

    // Mongo duplicate key
    if (error.code === 11000) {
      statusCode = 409
      const field = Object.keys(error.keyValue || {})[0]
      message = field ? `${field} already exists` : 'Duplicate value'
    }

    // JWT errors
    if (error.name === 'JsonWebTokenError') {
      statusCode = 401
      message = 'Invalid token'
    }
    if (error.name === 'TokenExpiredError') {
      statusCode = 401
      message = 'Token expired'
    }

    // Multer errors
    if (error.name === 'MulterError') {
      statusCode = 400
      message = error.message
    }

    error = new ApiError(statusCode, message, errors, error.stack)
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  res.status(error.statusCode || 500).json({
    success: false,
    statusCode: error.statusCode || 500,
    message: error.message,
    errors: error.errors || [],
    ...(env.NODE_ENV !== 'production' ? { stack: error.stack } : {}),
  })
}
