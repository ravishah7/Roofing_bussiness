import { Router } from 'express'
import * as mediaController from '../../controllers/media.controller.js'
import { protect, authorize } from '../../middleware/auth.middleware.js'
import { uploadImage } from '../../middleware/upload.middleware.js'

const router = Router()

router.use(protect, authorize('super_admin', 'admin', 'editor'))
router.get('/', mediaController.getAllMedia)
router.get('/folders', mediaController.getFolders)
router.post('/upload', uploadImage.array('files', 20), mediaController.uploadMedia)
router.delete('/:id', mediaController.deleteMedia)

export default router
