import Admin from '../models/Admin.model.js'
import ApiError from '../utils/ApiError.js'
import asyncHandler from '../utils/asyncHandler.js'
import { verifyAccessToken } from '../services/token.service.js'

/**
 * Verifies the Bearer access token, loads the admin, and rejects
 * requests where the password was changed after the token was issued.
 */
export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization
  const token = header && header.startsWith('Bearer ') ? header.split(' ')[1] : null

  if (!token) {
    throw ApiError.unauthorized('You are not logged in. Please log in to access this resource.')
  }

  let decoded
  try {
    decoded = verifyAccessToken(token)
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw ApiError.unauthorized('Access token expired')
    }
    throw ApiError.unauthorized('Invalid access token')
  }

  const admin = await Admin.findById(decoded.sub)
  if (!admin) {
    throw ApiError.unauthorized('The admin belonging to this token no longer exists')
  }
  if (!admin.isActive) {
    throw ApiError.forbidden('This account has been deactivated')
  }
  if (admin.changedPasswordAfter(decoded.iat)) {
    throw ApiError.unauthorized('Password was changed recently. Please log in again.')
  }

  req.admin = admin
  next()
})

/**
 * Role-based access control. Usage: authorize('super_admin', 'admin')
 */
export const authorize = (...roles) => (req, res, next) => {
  if (!req.admin) {
    return next(ApiError.unauthorized('Not authenticated'))
  }
  if (!roles.includes(req.admin.role)) {
    return next(ApiError.forbidden('You do not have permission to perform this action'))
  }
  next()
}

/**
 * Attaches req.admin if a valid Bearer token is present, but never
 * rejects the request otherwise — used on public read endpoints
 * (e.g. blog list) that expose extra data (drafts, view counts) to admins.
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization
  const token = header && header.startsWith('Bearer ') ? header.split(' ')[1] : null
  if (!token) return next()

  try {
    const decoded = verifyAccessToken(token)
    const admin = await Admin.findById(decoded.sub)
    if (admin && admin.isActive && !admin.changedPasswordAfter(decoded.iat)) {
      req.admin = admin
    }
  } catch {
    // Invalid/expired token on a public route — proceed as anonymous.
  }
  next()
})
