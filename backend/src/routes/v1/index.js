import { Router } from 'express'

import authRoutes from './auth.routes.js'
import dashboardRoutes from './dashboard.routes.js'
import blogRoutes from './blog.routes.js'
import categoryRoutes from './category.routes.js'
import projectRoutes from './project.routes.js'
import serviceRoutes from './service.routes.js'
import testimonialRoutes from './testimonial.routes.js'
import faqRoutes from './faq.routes.js'
import galleryRoutes from './gallery.routes.js'
import contactRoutes from './contact.routes.js'
import newsletterRoutes from './newsletter.routes.js'
import mediaRoutes from './media.routes.js'
import settingsRoutes from './settings.routes.js'
import userRoutes from './user.routes.js'
import seoRoutes from './seo.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/blogs', blogRoutes)
router.use('/categories', categoryRoutes)
router.use('/projects', projectRoutes)
router.use('/services', serviceRoutes)
router.use('/testimonials', testimonialRoutes)
router.use('/faqs', faqRoutes)
router.use('/gallery', galleryRoutes)
router.use('/contact', contactRoutes)
router.use('/newsletter', newsletterRoutes)
router.use('/media', mediaRoutes)
router.use('/settings', settingsRoutes)
router.use('/users', userRoutes)
router.use('/', seoRoutes) // exposes /api/v1/sitemap.xml and /api/v1/robots.txt

export default router
