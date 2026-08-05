import Testimonial from '../models/Testimonial.model.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import { createCrudController } from '../utils/crudFactory.js'

export const testimonialController = createCrudController(Testimonial, {
  searchFields: ['name', 'location', 'text'],
  populate: ['project'],
})

/**
 * PATCH /testimonials/:id/status  { status: 'approved' | 'rejected' }
 */
export const updateTestimonialStatus = asyncHandler(async (req, res) => {
  const doc = await Testimonial.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
  res.status(200).json(new ApiResponse(200, doc, 'Testimonial status updated'))
})
