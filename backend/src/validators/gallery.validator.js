import { body } from 'express-validator'

export const albumValidator = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 150 }),
  body('status').optional().isIn(['draft', 'published']),
]
