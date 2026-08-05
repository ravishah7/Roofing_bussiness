import Contact from '../models/Contact.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import ApiFeatures from '../utils/apiFeatures.js'
import EmailService from '../services/email.service.js'

/**
 * POST /contact — public
 */
export const submitContact = asyncHandler(async (req, res) => {
  const { name, email, phone, service, message } = req.body

  const contact = await Contact.create({
    name,
    email,
    phone,
    service,
    message,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  })

  // Fire-and-forget: a slow/broken SMTP server should never block the
  // user-facing response or fail the form submission.
  EmailService.sendContactNotification(contact).catch((err) =>
    console.error('[email] contact notification failed:', err.message)
  )
  EmailService.sendContactAutoReply(contact)
    .then(() => Contact.findByIdAndUpdate(contact._id, { notifiedAt: new Date() }))
    .catch((err) => console.error('[email] contact auto-reply failed:', err.message))

  res.status(201).json(new ApiResponse(201, { id: contact._id }, 'Message sent successfully'))
})

/**
 * GET /contact — admin
 */
export const getAllContacts = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(Contact.find(), req.query)
    .filter()
    .search(['name', 'email', 'message'])
    .sort('-createdAt')
    .limitFields()
    .paginate()

  const docs = await features.query.lean()
  const meta = await features.getMeta(Contact)
  res.status(200).json(new ApiResponse(200, docs, 'Contact messages fetched', meta))
})

export const getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id)
  if (!contact) throw ApiError.notFound('Contact message not found')
  res.status(200).json(new ApiResponse(200, contact, 'Contact message fetched'))
})

export const updateContactStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  const update = { status }
  if (status === 'resolved') update.repliedAt = new Date()

  const contact = await Contact.findByIdAndUpdate(req.params.id, update, { new: true })
  if (!contact) throw ApiError.notFound('Contact message not found')
  res.status(200).json(new ApiResponse(200, contact, 'Contact status updated'))
})

export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id)
  if (!contact) throw ApiError.notFound('Contact message not found')
  res.status(200).json(new ApiResponse(200, null, 'Contact message deleted'))
})
