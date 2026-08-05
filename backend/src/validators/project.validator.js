import { body } from 'express-validator'

export const projectValidator = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 150 }),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('status').optional().isIn(['draft', 'published']),
  body('category').optional().isMongoId().withMessage('Invalid category id'),
  body('completionDate').optional().isISO8601().withMessage('completionDate must be a valid date'),
]
