import { Router } from 'express'
import * as galleryController from '../../controllers/gallery.controller.js'
import { protect, authorize, optionalAuth } from '../../middleware/auth.middleware.js'
import { uploadImage } from '../../middleware/upload.middleware.js'
import validate from '../../middleware/validate.middleware.js'
import { albumValidator } from '../../validators/gallery.validator.js'

const router = Router()
const albumUploads = uploadImage.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'images', maxCount: 30 },
])

router.get('/', optionalAuth, galleryController.getAllAlbums)
router.get('/:slug', optionalAuth, galleryController.getAlbumBySlug)

router.use(protect, authorize('super_admin', 'admin', 'editor'))
router.post('/', albumUploads, albumValidator, validate, galleryController.createAlbum)
router.patch('/:id', albumUploads, galleryController.updateAlbum)
router.delete('/:id', authorize('super_admin', 'admin'), galleryController.deleteAlbum)
router.delete('/:id/images/:imageId', galleryController.deleteAlbumImage)

export default router
