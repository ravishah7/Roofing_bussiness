import { Router } from 'express'
import { testimonialController, updateTestimonialStatus } from '../../controllers/testimonial.controller.js'
import { protect, authorize, optionalAuth } from '../../middleware/auth.middleware.js'
import validate from '../../middleware/validate.middleware.js'
import { testimonialValidator } from '../../validators/testimonial.validator.js'

const router = Router()

// Public: submit a testimonial (goes in as "pending"); list only approved ones.
router.get('/', optionalAuth, (req, res, next) => {
  if (!req.admin) req.query.status = 'approved'
  next()
}, testimonialController.getAll)
router.post('/', testimonialValidator, validate, testimonialController.createOne)

router.use(protect, authorize('super_admin', 'admin', 'editor'))
router.get('/:id', testimonialController.getOne)
router.patch('/:id/status', updateTestimonialStatus)
router.patch('/:id', testimonialController.updateOne)
router.delete('/:id', authorize('super_admin', 'admin'), testimonialController.deleteOne)

export default router
