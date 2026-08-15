import { body } from 'express-validator'
 
export const testimonialValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 80 }),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('text').trim().notEmpty().withMessage('Testimonial text is required').isLength({ max: 1000 }),
  body('videoUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL({ require_protocol: true })
    .withMessage('Enter a valid video URL (must start with http:// or https://)'),
]
 