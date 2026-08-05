import { Router } from 'express'
import * as projectController from '../../controllers/project.controller.js'
import { protect, authorize, optionalAuth } from '../../middleware/auth.middleware.js'
import { uploadImage } from '../../middleware/upload.middleware.js'
import validate from '../../middleware/validate.middleware.js'
import { projectValidator } from '../../validators/project.validator.js'

const router = Router()
const projectUploads = uploadImage.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'gallery', maxCount: 15 },
  { name: 'beforeImages', maxCount: 10 },
  { name: 'afterImages', maxCount: 10 },
])

router.get('/', optionalAuth, projectController.getAllProjects)
router.get('/:slug', optionalAuth, projectController.getProjectBySlug)

router.use(protect, authorize('super_admin', 'admin', 'editor'))
router.post('/', projectUploads, projectValidator, validate, projectController.createProject)
router.patch('/:id', projectUploads, projectController.updateProject)
router.delete('/:id', authorize('super_admin', 'admin'), projectController.deleteProject)

export default router
