import crypto from 'crypto'
import Newsletter from '../models/Newsletter.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import ApiFeatures from '../utils/apiFeatures.js'
import EmailService from '../services/email.service.js'

/**
 * POST /newsletter/subscribe — public
 */
export const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body

  let sub = await Newsletter.findOne({ email })
  if (sub && sub.status === 'subscribed') {
    return res.status(200).json(new ApiResponse(200, null, 'You are already subscribed'))
  }

  const unsubscribeToken = crypto.randomBytes(20).toString('hex')

  if (sub) {
    sub.status = 'subscribed'
    sub.subscribedAt = new Date()
    sub.unsubscribedAt = undefined
    sub.unsubscribeToken = unsubscribeToken
    await sub.save()
  } else {
    sub = await Newsletter.create({ email, unsubscribeToken })
  }

  EmailService.sendNewsletterWelcome(email).catch((err) =>
    console.error('[email] newsletter welcome failed:', err.message)
  )

  res.status(201).json(new ApiResponse(201, null, 'Subscribed successfully'))
})

/**
 * GET /newsletter/unsubscribe?token=... — public, link from email footer
 */
export const unsubscribe = asyncHandler(async (req, res) => {
  const { token, email } = req.query

  const filter = token ? { unsubscribeToken: token } : { email }
  const sub = await Newsletter.findOne(filter).select('+unsubscribeToken')
  if (!sub) throw ApiError.notFound('Subscription not found')

  sub.status = 'unsubscribed'
  sub.unsubscribedAt = new Date()
  await sub.save()

  res.status(200).json(new ApiResponse(200, null, 'Unsubscribed successfully'))
})

/**
 * GET /newsletter — admin list
 */
export const getAllSubscribers = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(Newsletter.find(), req.query)
    .filter()
    .search(['email'])
    .sort('-createdAt')
    .limitFields()
    .paginate()

  const docs = await features.query.lean()
  const meta = await features.getMeta(Newsletter)
  res.status(200).json(new ApiResponse(200, docs, 'Subscribers fetched', meta))
})

/**
 * GET /newsletter/export — admin CSV export
 */
export const exportSubscribersCsv = asyncHandler(async (req, res) => {
  const subscribers = await Newsletter.find({ status: 'subscribed' }).lean()

  const header = 'email,subscribedAt\n'
  const rows = subscribers
    .map((s) => `${s.email},${new Date(s.subscribedAt).toISOString()}`)
    .join('\n')

  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename="newsletter-subscribers.csv"')
  res.status(200).send(header + rows)
})

export const deleteSubscriber = asyncHandler(async (req, res) => {
  const sub = await Newsletter.findByIdAndDelete(req.params.id)
  if (!sub) throw ApiError.notFound('Subscriber not found')
  res.status(200).json(new ApiResponse(200, null, 'Subscriber deleted'))
})
