import Blog from '../models/Blog.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import ApiFeatures from '../utils/apiFeatures.js'
import { uploadBuffer, deleteAsset } from '../services/cloudinary.service.js'
import { parseJsonField } from '../utils/parseJsonField.js'
import { idOrSlugFilter } from '../utils/findByIdOrSlug.js'
import Media from '../models/Media.model.js'

const SEARCH_FIELDS = ['title', 'excerpt', 'content']

async function trackMedia(uploaded, adminId) {
  try {
    await Media.create({
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      fileName: uploaded.original_filename || uploaded.public_id.split('/').pop(),
      format: uploaded.format,
      resourceType: uploaded.resource_type,
      size: uploaded.bytes,
      width: uploaded.width,
      height: uploaded.height,
      folder: uploaded.folder || 'roofing-cms',
      uploadedBy: adminId,
    })
  } catch {
    // non-fatal
  }
}

// Normalises the seo object that arrives from multipart forms.
// The admin form JSON.stringifies the whole seo object before appending
// it to FormData, so parseJsonField converts it back to a plain object.
// However seo.keywords is a [String] array in the schema — if it arrives
// as a comma-separated string (from the keywords <Input> field) Mongoose
// crashes trying to cast it. We normalise it to a real array here.
function normaliseSeo(seo) {
  if (!seo) return seo
  const parsed = parseJsonField(seo)
  if (!parsed || typeof parsed !== 'object') return parsed
  if (typeof parsed.keywords === 'string') {
    parsed.keywords = parsed.keywords
      ? parsed.keywords.split(',').map((k) => k.trim()).filter(Boolean)
      : []
  }
  // If keywords is already an array leave it alone
  return parsed
}

export const getAllBlogs = asyncHandler(async (req, res) => {
  const baseFilter = req.admin ? {} : { status: 'published' }
  const features = new ApiFeatures(Blog.find(baseFilter), req.query)
    .filter()
    .search(SEARCH_FIELDS)
    .sort('-publishedAt')
    .limitFields()
    .paginate()

  const docs = await features.query
    .populate('category', 'name slug')
    .populate('author', 'name avatar')
    .lean()
  const meta = await features.getMeta(Blog)
  res.status(200).json(new ApiResponse(200, docs, 'Blog list fetched', meta))
})

export const getBlogBySlug = asyncHandler(async (req, res) => {
  const filter = req.admin
    ? idOrSlugFilter(req.params.slug)
    : { ...idOrSlugFilter(req.params.slug), status: 'published' }
  const blog = await Blog.findOne(filter)
    .populate('category', 'name slug')
    .populate('author', 'name avatar')

  if (!blog) throw ApiError.notFound('Blog post not found')

  if (!req.admin) {
    blog.views += 1
    await blog.save({ validateBeforeSave: false })
  }

  res.status(200).json(new ApiResponse(200, blog, 'Blog post fetched'))
})

export const createBlog = asyncHandler(async (req, res) => {
  const payload = { ...req.body, author: req.admin._id }

  if (payload.tags !== undefined) payload.tags = parseJsonField(payload.tags)
  if (payload.seo !== undefined) payload.seo = normaliseSeo(payload.seo)

  if (req.file) {
    const uploaded = await uploadBuffer(req.file.buffer, { folder: 'roofing-cms/blog' })
    payload.featuredImage = { url: uploaded.secure_url, publicId: uploaded.public_id, alt: req.body.title }
    await trackMedia(uploaded, req.admin._id)
  }

  const blog = await Blog.create(payload)
  res.status(201).json(new ApiResponse(201, blog, 'Blog post created'))
})

export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (!blog) throw ApiError.notFound('Blog post not found')

  if (req.body.tags !== undefined) req.body.tags = parseJsonField(req.body.tags)
  if (req.body.seo !== undefined) req.body.seo = normaliseSeo(req.body.seo)

  if (req.file) {
    if (blog.featuredImage?.publicId) {
      await deleteAsset(blog.featuredImage.publicId).catch(() => null)
    }
    const uploaded = await uploadBuffer(req.file.buffer, { folder: 'roofing-cms/blog' })
    req.body.featuredImage = { url: uploaded.secure_url, publicId: uploaded.public_id, alt: req.body.title || blog.title }
    await trackMedia(uploaded, req.admin._id)
  }

  Object.assign(blog, req.body)
  await blog.save()
  res.status(200).json(new ApiResponse(200, blog, 'Blog post updated'))
})

export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id)
  if (!blog) throw ApiError.notFound('Blog post not found')
  if (blog.featuredImage?.publicId) {
    await deleteAsset(blog.featuredImage.publicId).catch(() => null)
  }
  res.status(200).json(new ApiResponse(200, null, 'Blog post deleted'))
})

export const addComment = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug, status: 'published' })
  if (!blog) throw ApiError.notFound('Blog post not found')
  blog.comments.push({ name: req.body.name, email: req.body.email, message: req.body.message })
  await blog.save()
  res.status(201).json(new ApiResponse(201, null, 'Comment submitted and awaiting moderation'))
})

export const moderateComment = asyncHandler(async (req, res) => {
  const { id, commentId } = req.params
  const { isApproved, isSpam } = req.body
  const blog = await Blog.findById(id)
  if (!blog) throw ApiError.notFound('Blog post not found')
  const comment = blog.comments.id(commentId)
  if (!comment) throw ApiError.notFound('Comment not found')
  if (typeof isApproved === 'boolean') comment.isApproved = isApproved
  if (typeof isSpam === 'boolean') comment.isSpam = isSpam
  await blog.save()
  res.status(200).json(new ApiResponse(200, blog.comments, 'Comment updated'))
})

export const deleteComment = asyncHandler(async (req, res) => {
  const { id, commentId } = req.params
  const blog = await Blog.findById(id)
  if (!blog) throw ApiError.notFound('Blog post not found')
  blog.comments.id(commentId)?.deleteOne()
  await blog.save()
  res.status(200).json(new ApiResponse(200, null, 'Comment deleted'))
})
