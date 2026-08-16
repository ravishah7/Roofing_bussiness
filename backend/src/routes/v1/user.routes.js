import { Router } from 'express'
import * as userController from '../../controllers/user.controller.js'
import { register } from '../../controllers/auth.controller.js'
import { protect, authorize } from '../../middleware/auth.middleware.js'
import { uploadImage } from '../../middleware/upload.middleware.js'

const router = Router()

router.use(protect)
router.patch('/me', userController.updateMe)
router.patch('/me/avatar', uploadImage.single('avatar'), userController.updateMyAvatar)

router.use(authorize('super_admin'))
router.post('/', register)
router.get('/', userController.getAllUsers)
router.get('/:id', userController.getUserById)
router.patch('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)

export default router