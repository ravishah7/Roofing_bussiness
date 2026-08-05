import Blog from '../models/Blog.model.js'
import Project from '../models/Project.model.js'
import Service from '../models/Service.model.js'
import Testimonial from '../models/Testimonial.model.js'
import Contact from '../models/Contact.model.js'
import Newsletter from '../models/Newsletter.model.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

/**
 * GET /dashboard/stats
 * High-level counters for the admin dashboard's top cards.
 */
export const getStats = asyncHandler(async (req, res) => {
  const [
    totalBlogs,
    publishedBlogs,
    totalProjects,
    totalServices,
    pendingTestimonials,
    approvedTestimonials,
    newContacts,
    totalContacts,
    subscriberCount,
  ] = await Promise.all([
    Blog.countDocuments(),
    Blog.countDocuments({ status: 'published' }),
    Project.countDocuments(),
    Service.countDocuments({ status: 'published' }),
    Testimonial.countDocuments({ status: 'pending' }),
    Testimonial.countDocuments({ status: 'approved' }),
    Contact.countDocuments({ status: 'new' }),
    Contact.countDocuments(),
    Newsletter.countDocuments({ status: 'subscribed' }),
  ])

  res.status(200).json(
    new ApiResponse(200, {
      blogs: { total: totalBlogs, published: publishedBlogs },
      projects: { total: totalProjects },
      services: { total: totalServices },
      testimonials: { pending: pendingTestimonials, approved: approvedTestimonials },
      contacts: { new: newContacts, total: totalContacts },
      newsletter: { subscribers: subscriberCount },
    }, 'Dashboard stats fetched')
  )
})

/**
 * GET /dashboard/recent-contacts?limit=5
 */
export const getRecentContacts = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 5, 20)
  const docs = await Contact.find().sort('-createdAt').limit(limit).lean()
  res.status(200).json(new ApiResponse(200, docs, 'Recent contacts fetched'))
})

/**
 * GET /dashboard/recent-blogs?limit=5
 */
export const getRecentBlogs = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 5, 20)
  const docs = await Blog.find().sort('-createdAt').limit(limit).select('title slug status views createdAt').lean()
  res.status(200).json(new ApiResponse(200, docs, 'Recent blogs fetched'))
})

/**
 * GET /dashboard/recent-projects?limit=5
 */
export const getRecentProjects = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 5, 20)
  const docs = await Project.find().sort('-createdAt').limit(limit).select('title slug status completionDate').lean()
  res.status(200).json(new ApiResponse(200, docs, 'Recent projects fetched'))
})

/**
 * GET /dashboard/contacts-trend?days=30
 * Daily contact-submission counts for a simple line/bar chart.
 */
export const getContactsTrend = asyncHandler(async (req, res) => {
  const days = Math.min(Number(req.query.days) || 30, 180)
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const trend = await Contact.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { date: '$_id', count: 1, _id: 0 } },
  ])

  res.status(200).json(new ApiResponse(200, trend, 'Contacts trend fetched'))
})

/**
 * GET /dashboard/top-blogs?limit=5 — most-viewed published posts
 */
export const getTopBlogs = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 5, 20)
  const docs = await Blog.find({ status: 'published' })
    .sort('-views')
    .limit(limit)
    .select('title slug views')
    .lean()
  res.status(200).json(new ApiResponse(200, docs, 'Top blogs fetched'))
})
