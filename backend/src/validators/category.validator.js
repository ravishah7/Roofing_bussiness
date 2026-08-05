import { body } from 'express-validator'

export const categoryValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 60 }),
  body('type').optional().isIn(['blog', 'gallery', 'project']),
]
