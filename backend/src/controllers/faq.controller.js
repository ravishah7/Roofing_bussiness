import Faq from '../models/Faq.model.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import { createCrudController } from '../utils/crudFactory.js'

export const faqController = createCrudController(Faq, { searchFields: ['question', 'answer', 'category'] })

/**
 * PATCH /faqs/reorder
 * body: { order: [{ id, order }, ...] }
 */
export const reorderFaqs = asyncHandler(async (req, res) => {
  const { order } = req.body
  await Promise.all(order.map(({ id, order: pos }) => Faq.findByIdAndUpdate(id, { order: pos })))
  const docs = await Faq.find().sort('order')
  res.status(200).json(new ApiResponse(200, docs, 'FAQ order updated'))
})
