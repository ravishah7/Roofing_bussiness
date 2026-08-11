import { Router } from 'express'
import * as settingsController from '../../controllers/settings.controller.js'
import { protect, authorize } from '../../middleware/auth.middleware.js'
import { uploadImage } from '../../middleware/upload.middleware.js'

const router = Router()

router.get('/', settingsController.getSettings)

router.use(protect, authorize('super_admin', 'admin'))
router.patch('/home-before-after', settingsController.setHomeBeforeAfter)
router.patch('/', settingsController.updateSettings)
router.patch('/logo', uploadImage.single('logo'), settingsController.updateLogo)
router.patch('/favicon', uploadImage.single('favicon'), settingsController.updateFavicon)

export default router
