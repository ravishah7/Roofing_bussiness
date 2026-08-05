import { body } from 'express-validator'

// Plain lowercase, not express-validator's `.normalizeEmail()`.
// normalizeEmail() applies Gmail-specific rewriting (strips dots and
// "+tag" subaddressing from @gmail.com addresses), which does NOT match
// how the Admin model stores emails (schema only lowercases on save).
// That mismatch caused real accounts with a dot in the Gmail address to
// fail login with "Invalid email or password" even with the correct
// password, because the lookup email no longer matched the stored one.
const toLowerEmail = (value) => value.toLowerCase()

export const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 80 }),
  body('email').trim().isEmail().withMessage('A valid email is required').customSanitizer(toLowerEmail),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/\d/)
    .withMessage('Password must contain a number'),
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
