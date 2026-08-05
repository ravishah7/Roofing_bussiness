import { Router } from 'express'
import * as serviceController from '../../controllers/service.controller.js'
import { protect, authorize, optionalAuth } from '../../middleware/auth.middleware.js'
import { uploadImage } from '../../middleware/upload.middleware.js'
import validate from '../../middleware/validate.middleware.js'
import { serviceValidator } from '../../validators/service.validator.js'

const router = Router()
const serviceUploads = uploadImage.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'gallery', maxCount: 15 },
])

router.get('/', optionalAuth, serviceController.getAllServices)
router.get('/:slug', optionalAuth, serviceController.getServiceBySlug)

router.use(protect, authorize('super_admin', 'admin', 'editor'))
router.patch('/reorder', serviceController.reorderServices)
router.post('/', serviceUploads, serviceValidator, validate, serviceController.createService)
router.patch('/:id', serviceUploads, serviceController.updateService)
router.delete('/:id', authorize('super_admin', 'admin'), serviceController.deleteService)

export default router
