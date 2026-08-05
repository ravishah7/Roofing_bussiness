import { validationResult } from 'express-validator'
import ApiError from '../utils/ApiError.js'

/**
 * Runs after an array of express-validator checks; collects errors
 * into the ApiError shape instead of letting each route handle it.
 */
export default function validate(req, res, next) {
  const errors = validationResult(req)
  if (errors.isEmpty()) return next()

  const formatted = errors.array().map((e) => ({ field: e.path, message: e.msg }))
  next(ApiError.badRequest('Validation failed', formatted))
}
