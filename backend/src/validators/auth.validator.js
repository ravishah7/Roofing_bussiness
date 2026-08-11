import { body } from 'express-validator'

const toLowerEmail = (value) => value.toLowerCase()

export const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 80 }),
  body('email').trim().isEmail().withMessage('A valid email is required').customSanitizer(toLowerEmail),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters').matches(/\d/).withMessage('Password must contain a number'),
]

export const loginValidator = [
  body('email').trim().isEmail().withMessage('A valid email is required').customSanitizer(toLowerEmail),
  body('password').notEmpty().withMessage('Password is required'),
]

export const forgotPasswordValidator = [
  body('email').trim().isEmail().withMessage('A valid email is required').customSanitizer(toLowerEmail),
]

export const resetPasswordValidator = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
]

export const updatePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
]
