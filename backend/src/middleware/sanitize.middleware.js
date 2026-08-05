import { sanitize } from 'express-mongo-sanitize'
import { clean } from 'xss-clean/lib/xss.js'

/**
 * Express 5 makes `req.query` a getter-only property, so the stock
 * express-mongo-sanitize middleware (which does `req.query = ...`)
 * throws. Its `sanitize()` helper mutates the target object in place
 * and returns the same reference, so we call it directly per-field
 * without ever reassigning req.query/req.params.
 */
export function mongoSanitizeMiddleware(req, res, next) {
  if (req.body) sanitize(req.body)
  if (req.params) sanitize(req.params)
  if (req.query) sanitize(req.query)
  next()
}

/**
 * xss-clean has the same Express-5 incompatibility (it reassigns
 * req.query to a brand-new object). `clean()` returns a new object,
 * so instead of reassigning we clear and repopulate the existing
 * object in place, preserving the getter-only reference.
 */
function cleanInPlace(target) {
  if (!target || typeof target !== 'object') return
  const cleaned = clean(target)
  Object.keys(target).forEach((key) => delete target[key])
  Object.assign(target, cleaned)
}

export function xssCleanMiddleware(req, res, next) {
  if (req.body) cleanInPlace(req.body)
  if (req.params) cleanInPlace(req.params)
  if (req.query) cleanInPlace(req.query)
  next()
}

export default mongoSanitizeMiddleware
