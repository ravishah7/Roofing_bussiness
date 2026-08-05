import { Router } from 'express'
import * as newsletterController from '../../controllers/newsletter.controller.js'
import { protect, authorize } from '../../middleware/auth.middleware.js'
import validate from '../../middleware/validate.middleware.js'
import { subscribeValidator } from '../../validators/newsletter.validator.js'

const router = Router()

router.post('/subscribe', subscribeValidator, validate, newsletterController.subscribe)
router.get('/unsubscribe', newsletterController.unsubscribe)

router.use(protect, authorize('super_admin', 'admin'))
router.get('/', newsletterController.getAllSubscribers)
router.get('/export', newsletterController.exportSubscribersCsv)
router.delete('/:id', newsletterController.deleteSubscriber)

export default router
