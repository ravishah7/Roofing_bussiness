import { body } from 'express-validator'

export const faqValidator = [
  body('question').trim().notEmpty().withMessage('Question is required').isLength({ max: 250 }),
  body('answer').trim().notEmpty().withMessage('Answer is required').isLength({ max: 2000 }),
]
