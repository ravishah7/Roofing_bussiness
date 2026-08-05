import { body } from 'express-validator'

export const serviceValidator = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 120 }),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('shortDescription').optional().isLength({ max: 250 }),
  body('status').optional().isIn(['draft', 'published']),
  body('pricing.type').optional().isIn(['fixed', 'range', 'quote']),
]
