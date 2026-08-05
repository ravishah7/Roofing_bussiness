import Project from '../models/Project.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import ApiFeatures from '../utils/apiFeatures.js'
import { uploadBuffer, deleteAsset } from '../services/cloudinary.service.js'
import { parseJsonField } from '../utils/parseJsonField.js'
import { idOrSlugFilter } from '../utils/findByIdOrSlug.js'

const SEARCH_FIELDS = ['title', 'description']

async function uploadMany(files = [], folder) {
  const uploaded = await Promise.all(files.map((f) => uploadBuffer(f.buffer, { folder })))
  return uploaded.map((u) => ({ url: u.secure_url, publicId: u.public_id, alt: '' }))
}

export const getAllProjects = asyncHandler(async (req, res) => {
  const baseFilter = req.admin ? {} : { status: 'published' }
  const features = new ApiFeatures(Project.find(baseFilter), req.query)
    .filter()
    .search(SEARCH_FIELDS)
    .sort('-completionDate')
    .limitFields()
    .paginate()

  const docs = await features.query.populate('category', 'name slug').populate('servicesUsed', 'title slug').lean()
  const meta = await features.getMeta(Project)

  res.status(200).json(new ApiResponse(200, docs, 'Project list fetched', meta))
})

export const getProjectBySlug = asyncHandler(async (req, res) => {
  const filter = req.admin
    ? idOrSlugFilter(req.params.slug)
    : { ...idOrSlugFilter(req.params.slug), status: 'published' }
  const project = await Project.findOne(filter).populate('category', 'name slug').populate('servicesUsed', 'title slug')
  if (!project) throw ApiError.notFound('Project not found')
  res.status(200).json(new ApiResponse(200, project, 'Project fetched'))
})

export const createProject = asyncHandler(async (req, res) => {
  const payload = { ...req.body }
  const files = req.files || {}

  // See parseJsonField.js — multipart requests deliver these as JSON
  // strings, and Mongoose silently drops them if left unparsed.
  if (payload.location !== undefined) payload.location = parseJsonField(payload.location)
  if (payload.customerReview !== undefined) payload.customerReview = parseJsonField(payload.customerReview)

  if (files.coverImage?.[0]) {
    const [uploaded] = await uploadMany(files.coverImage, 'roofing-cms/projects')
    payload.coverImage = uploaded
  }
  if (files.gallery?.length) payload.gallery = await uploadMany(files.gallery, 'roofing-cms/projects/gallery')
  if (files.beforeImages?.length) payload.beforeImages = await uploadMany(files.beforeImages, 'roofing-cms/projects/before')
  if (files.afterImages?.length) payload.afterImages = await uploadMany(files.afterImages, 'roofing-cms/projects/after')

  const project = await Project.create(payload)
  res.status(201).json(new ApiResponse(201, project, 'Project created'))
})

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
  if (!project) throw ApiError.notFound('Project not found')

  const files = req.files || {}

  if (req.body.location !== undefined) req.body.location = parseJsonField(req.body.location)
  if (req.body.customerReview !== undefined) req.body.customerReview = parseJsonField(req.body.customerReview)

  if (files.coverImage?.[0]) {
    if (project.coverImage?.publicId) await deleteAsset(project.coverImage.publicId).catch(() => null)
    const [uploaded] = await uploadMany(files.coverImage, 'roofing-cms/projects')
    req.body.coverImage = uploaded
  }
  if (files.gallery?.length) {
    req.body.gallery = [...project.gallery, ...(await uploadMany(files.gallery, 'roofing-cms/projects/gallery'))]
  }
  if (files.beforeImages?.length) {
    req.body.beforeImages = [...project.beforeImages, ...(await uploadMany(files.beforeImages, 'roofing-cms/projects/before'))]
  }
  if (files.afterImages?.length) {
    req.body.afterImages = [...project.afterImages, ...(await uploadMany(files.afterImages, 'roofing-cms/projects/after'))]
  }

  Object.assign(project, req.body)
  await project.save()

  res.status(200).json(new ApiResponse(200, project, 'Project updated'))
})

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id)
  if (!project) throw ApiError.notFound('Project not found')

  const allImages = [
    project.coverImage,
    ...(project.gallery || []),
    ...(project.beforeImages || []),
    ...(project.afterImages || []),
  ].filter(Boolean)

  await Promise.all(allImages.map((img) => deleteAsset(img.publicId).catch(() => null)))

  res.status(200).json(new ApiResponse(200, null, 'Project deleted'))
})
