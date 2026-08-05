import { Router } from 'express'
import * as blogController from '../../controllers/blog.controller.js'
import { protect, authorize, optionalAuth } from '../../middleware/auth.middleware.js'
import { uploadImage } from '../../middleware/upload.middleware.js'
import validate from '../../middleware/validate.middleware.js'
import { blogValidator, commentValidator } from '../../validators/blog.validator.js'

const router = Router()

router.get('/', optionalAuth, blogController.getAllBlogs)
router.get('/:slug', optionalAuth, blogController.getBlogBySlug)
router.post('/:slug/comments', commentValidator, validate, blogController.addComment)

router.use(protect, authorize('super_admin', 'admin', 'editor'))
router.post('/', uploadImage.single('featuredImage'), blogValidator, validate, blogController.createBlog)
router.patch('/:id', uploadImage.single('featuredImage'), blogController.updateBlog)
router.delete('/:id', authorize('super_admin', 'admin'), blogController.deleteBlog)
router.patch('/:id/comments/:commentId', blogController.moderateComment)
router.delete('/:id/comments/:commentId', blogController.deleteComment)

export default router
