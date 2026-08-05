import { Router } from 'express'
import { faqController, reorderFaqs } from '../../controllers/faq.controller.js'
import { protect, authorize } from '../../middleware/auth.middleware.js'
import validate from '../../middleware/validate.middleware.js'
import { faqValidator } from '../../validators/faq.validator.js'

const router = Router()

router.get('/', (req, res, next) => {
  if (!req.headers.authorization) req.query.isPublished = 'true'
  next()
}, faqController.getAll)

router.use(protect, authorize('super_admin', 'admin', 'editor'))
router.patch('/reorder', reorderFaqs)
router.post('/', faqValidator, validate, faqController.createOne)
router.get('/:id', faqController.getOne)
router.patch('/:id', faqController.updateOne)
router.delete('/:id', authorize('super_admin', 'admin'), faqController.deleteOne)

export default router
