import { Router } from 'express'
import * as dashboardController from '../../controllers/dashboard.controller.js'
import { protect, authorize } from '../../middleware/auth.middleware.js'

const router = Router()

router.use(protect, authorize('super_admin', 'admin', 'editor'))
router.get('/stats', dashboardController.getStats)
router.get('/recent-contacts', dashboardController.getRecentContacts)
router.get('/recent-blogs', dashboardController.getRecentBlogs)
router.get('/recent-projects', dashboardController.getRecentProjects)
router.get('/contacts-trend', dashboardController.getContactsTrend)
router.get('/top-blogs', dashboardController.getTopBlogs)

export default router
