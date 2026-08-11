import { body } from 'express-validator'

export const blogValidator = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 150 }),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('excerpt').optional().isLength({ max: 300 }),
  body('status').optional().isIn(['draft', 'published', 'archived']),
  body('category').optional().isMongoId().withMessage('Invalid category id'),
  body('tags')
    .optional()
    .customSanitizer((value) => {
      if (Array.isArray(value)) return value
      if (typeof value === 'string') {
        try { return JSON.parse(value) } catch { return value.split(',').map(t => t.trim()).filter(Boolean) }
      }
      return value
    })
    .isArray().withMessage('Tags must be an array'),
]

export const commentValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 80 }),
  body('email').trim().isEmail().withMessage('A valid email is required'),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 2000 }),
]
