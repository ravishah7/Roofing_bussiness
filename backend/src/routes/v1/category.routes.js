import { Router } from 'express'
import { categoryController } from '../../controllers/category.controller.js'
import { protect, authorize } from '../../middleware/auth.middleware.js'
import validate from '../../middleware/validate.middleware.js'
import { categoryValidator } from '../../validators/category.validator.js'

const router = Router()

router.get('/', categoryController.getAll)
router.get('/:id', categoryController.getOne)

router.use(protect, authorize('super_admin', 'admin', 'editor'))
router.post('/', categoryValidator, validate, categoryController.createOne)
router.patch('/:id', categoryController.updateOne)
router.delete('/:id', authorize('super_admin', 'admin'), categoryController.deleteOne)

export default router
