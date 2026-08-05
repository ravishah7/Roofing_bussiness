import { Router } from 'express'
import * as authController from '../../controllers/auth.controller.js'
import { protect, authorize } from '../../middleware/auth.middleware.js'
import { authLimiter } from '../../middleware/rateLimiter.middleware.js'
import validate from '../../middleware/validate.middleware.js'
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  updatePasswordValidator,
} from '../../validators/auth.validator.js'

const router = Router()

router.post(
  '/register',
  protect,
  authorize('super_admin'),
  registerValidator,
  validate,
  authController.register
)

router.post('/login', authLimiter, loginValidator, validate, authController.login)
router.post('/refresh', authLimiter, authController.refresh)
router.post('/logout', protect, authController.logout)
router.get('/me', protect, authController.getMe)

router.get('/verify-email/:token', authController.verifyEmail)
router.post('/forgot-password', authLimiter, forgotPasswordValidator, validate, authController.forgotPassword)
router.post('/reset-password', authLimiter, resetPasswordValidator, validate, authController.resetPassword)
router.patch('/update-password', protect, updatePasswordValidator, validate, authController.updatePassword)

export default router
