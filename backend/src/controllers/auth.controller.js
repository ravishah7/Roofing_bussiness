import crypto from 'crypto'
import Admin from '../models/Admin.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import EmailService from '../services/email.service.js'
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  refreshCookieOptions,
} from '../services/token.service.js'

const MAX_REFRESH_TOKENS_PER_ADMIN = 5

async function issueTokens(admin, req) {
  const accessToken = signAccessToken(admin)
  const refreshToken = signRefreshToken(admin)

  admin.refreshTokens = admin.refreshTokens || []
  admin.refreshTokens.push({
    token: refreshToken,
    userAgent: req.headers['user-agent'],
    ip: req.ip,
  })
  // Cap stored refresh tokens (oldest dropped first) so the array can't grow unbounded.
  if (admin.refreshTokens.length > MAX_REFRESH_TOKENS_PER_ADMIN) {
    admin.refreshTokens = admin.refreshTokens.slice(-MAX_REFRESH_TOKENS_PER_ADMIN)
  }
  await admin.save({ validateBeforeSave: false })

  return { accessToken, refreshToken }
}

/**
 * POST /auth/register
 * Only usable by an already-authenticated super_admin to create new
 * admin/editor accounts (mounted behind `protect` + `authorize('super_admin')`).
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'editor' } = req.body

  const existing = await Admin.findOne({ email })
  if (existing) throw ApiError.conflict('An account with this email already exists')

  const admin = await Admin.create({ name, email, password, role })
  const rawToken = admin.createEmailVerificationToken()
  await admin.save({ validateBeforeSave: false })

  await EmailService.sendVerificationEmail(admin, rawToken).catch((err) =>
    console.error('[email] verification send failed:', err.message)
  )

  res.status(201).json(new ApiResponse(201, admin.toSafeObject(), 'Admin account created. Verification email sent.'))
})

/**
 * POST /auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const admin = await Admin.findOne({ email }).select('+password')
  if (!admin || !(await admin.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password')
  }
  if (!admin.isActive) {
    throw ApiError.forbidden('This account has been deactivated. Contact a super admin.')
  }

  const { accessToken, refreshToken } = await issueTokens(admin, req)

  admin.lastLoginAt = new Date()
  await admin.save({ validateBeforeSave: false })

  res
    .cookie('refreshToken', refreshToken, refreshCookieOptions())
    .status(200)
    .json(new ApiResponse(200, { admin: admin.toSafeObject(), accessToken }, 'Logged in successfully'))
})

/**
 * POST /auth/refresh
 * Reads the httpOnly refresh cookie, rotates it, and issues a new access token.
 */
export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken
  if (!token) throw ApiError.unauthorized('No refresh token provided')

  let decoded
  try {
    decoded = verifyRefreshToken(token)
  } catch {
    throw ApiError.unauthorized('Invalid or expired refresh token')
  }

  const admin = await Admin.findById(decoded.sub)
  if (!admin) throw ApiError.unauthorized('Admin no longer exists')

  const stored = admin.refreshTokens?.find((rt) => rt.token === token)
  if (!stored) {
    // Token reuse/theft detection: invalidate all sessions for this admin.
    admin.refreshTokens = []
    await admin.save({ validateBeforeSave: false })
    throw ApiError.unauthorized('Refresh token not recognized. Please log in again.')
  }

  // Rotate: drop the old token, issue a new pair.
  admin.refreshTokens = admin.refreshTokens.filter((rt) => rt.token !== token)
  const { accessToken, refreshToken } = await issueTokens(admin, req)

  res
    .cookie('refreshToken', refreshToken, refreshCookieOptions())
    .status(200)
    .json(new ApiResponse(200, { accessToken }, 'Access token refreshed'))
})

/**
 * POST /auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken
  if (token) {
    const admin = await Admin.findById(req.admin?._id)
    if (admin) {
      admin.refreshTokens = admin.refreshTokens.filter((rt) => rt.token !== token)
      await admin.save({ validateBeforeSave: false })
    }
  }
  res.clearCookie('refreshToken', { path: '/api/v1/auth' })
  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'))
})

/**
 * GET /auth/me
 */
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, req.admin.toSafeObject(), 'Current admin fetched'))
})

/**
 * GET /auth/verify-email/:token
 */
export const verifyEmail = asyncHandler(async (req, res) => {
  const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex')

  const admin = await Admin.findOne({
    emailVerificationToken: hashed,
    emailVerificationExpires: { $gt: Date.now() },
  }).select('+emailVerificationToken +emailVerificationExpires')

  if (!admin) throw ApiError.badRequest('Verification link is invalid or has expired')

  admin.isEmailVerified = true
  admin.emailVerificationToken = undefined
  admin.emailVerificationExpires = undefined
  await admin.save({ validateBeforeSave: false })

  res.status(200).json(new ApiResponse(200, null, 'Email verified successfully'))
})

/**
 * POST /auth/forgot-password
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const admin = await Admin.findOne({ email: req.body.email })

  // Always respond 200 to avoid leaking which emails have accounts.
  if (!admin) {
    return res
      .status(200)
      .json(new ApiResponse(200, null, 'If an account exists for that email, a reset link has been sent.'))
  }

  const rawToken = admin.createPasswordResetToken()
  await admin.save({ validateBeforeSave: false })

  try {
    await EmailService.sendPasswordResetEmail(admin, rawToken)
  } catch (err) {
    admin.passwordResetToken = undefined
    admin.passwordResetExpires = undefined
    await admin.save({ validateBeforeSave: false })
    throw ApiError.internal('Failed to send password reset email. Please try again later.')
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, 'If an account exists for that email, a reset link has been sent.'))
})

/**
 * POST /auth/reset-password
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body
  const hashed = crypto.createHash('sha256').update(token).digest('hex')

  const admin = await Admin.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+passwordResetToken +passwordResetExpires')

  if (!admin) throw ApiError.badRequest('Reset link is invalid or has expired')

  admin.password = password
  admin.passwordResetToken = undefined
  admin.passwordResetExpires = undefined
  admin.refreshTokens = [] // force re-login on all devices
  await admin.save()

  res.status(200).json(new ApiResponse(200, null, 'Password reset successfully. Please log in.'))
})

/**
 * PATCH /auth/update-password
 */
export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const admin = await Admin.findById(req.admin._id).select('+password')

  if (!(await admin.comparePassword(currentPassword))) {
    throw ApiError.unauthorized('Current password is incorrect')
  }

  admin.password = newPassword
  admin.refreshTokens = []
  await admin.save()

  res.status(200).json(new ApiResponse(200, null, 'Password updated. Please log in again.'))
})
