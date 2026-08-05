import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export function signAccessToken(admin) {
  return jwt.sign(
    { sub: admin._id.toString(), role: admin.role, tokenType: 'access' },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN }
  )
}

export function signRefreshToken(admin) {
  return jwt.sign(
    { sub: admin._id.toString(), tokenType: 'refresh' },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN }
  )
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET)
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET)
}

/**
 * Cookie options for the httpOnly refresh token cookie.
 * `secure` is forced on in production (requires HTTPS).
 */
export function refreshCookieOptions() {
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000
  return {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: thirtyDaysMs,
    path: '/api/' + env.API_VERSION + '/auth',
  }
}
