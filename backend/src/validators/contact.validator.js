import { body } from 'express-validator'
export const contactValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('A valid email is required').customSanitizer((v) => v.toLowerCase()),
  body('phone').optional().trim().isLength({ max: 30 }),
  body('message').optional().trim().isLength({ max: 3000 }),
]
export const updateContactStatusValidator = [
  body('status').isIn(['new', 'in_progress', 'resolved', 'spam']).withMessage('Invalid status'),
]
