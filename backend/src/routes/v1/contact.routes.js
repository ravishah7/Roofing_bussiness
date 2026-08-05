import { Router } from 'express'
import * as contactController from '../../controllers/contact.controller.js'
import { protect, authorize } from '../../middleware/auth.middleware.js'
import { contactLimiter } from '../../middleware/rateLimiter.middleware.js'
import validate from '../../middleware/validate.middleware.js'
import { contactValidator, updateContactStatusValidator } from '../../validators/contact.validator.js'

const router = Router()

router.post('/', contactLimiter, contactValidator, validate, contactController.submitContact)

router.use(protect, authorize('super_admin', 'admin', 'editor'))
router.get('/', contactController.getAllContacts)
router.get('/:id', contactController.getContactById)
router.patch('/:id/status', updateContactStatusValidator, validate, contactController.updateContactStatus)
router.delete('/:id', authorize('super_admin', 'admin'), contactController.deleteContact)

export default router
