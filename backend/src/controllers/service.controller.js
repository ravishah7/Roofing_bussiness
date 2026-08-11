import Service from '../models/Service.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import ApiFeatures from '../utils/apiFeatures.js'
import { uploadBuffer, deleteAsset } from '../services/cloudinary.service.js'
import { parseJsonField } from '../utils/parseJsonField.js'
import { idOrSlugFilter } from '../utils/findByIdOrSlug.js'
import Media from '../models/Media.model.js'

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
  } catch { /* non-fatal */ }
}

const SEARCH_FIELDS = ['title', 'shortDescription', 'description']

export const getAllServices = asyncHandler(async (req, res) => {
  const baseFilter = req.admin ? {} : { status: 'published' }
  const features = new ApiFeatures(Service.find(baseFilter), req.query)
    .filter().search(SEARCH_FIELDS).sort('order').limitFields().paginate()
  const docs = await features.query.lean()
  const meta = await features.getMeta(Service)
  res.status(200).json(new ApiResponse(200, docs, 'Service list fetched', meta))
})

export const getServiceBySlug = asyncHandler(async (req, res) => {
  const filter = req.admin
    ? idOrSlugFilter(req.params.slug)
    : { ...idOrSlugFilter(req.params.slug), status: 'published' }
  const service = await Service.findOne(filter)
  if (!service) throw ApiError.notFound('Service not found')
  res.status(200).json(new ApiResponse(200, service, 'Service fetched'))
})

export const createService = asyncHandler(async (req, res) => {
  const payload = { ...req.body }
  const files = req.files || {}
  if (payload.pricing !== undefined) payload.pricing = parseJsonField(payload.pricing)
  if (files.coverImage?.[0]) {
    const uploaded = await uploadBuffer(files.coverImage[0].buffer, { folder: 'roofing-cms/services' })
    payload.coverImage = { url: uploaded.secure_url, publicId: uploaded.public_id, alt: req.body.title }
    await trackMedia(uploaded, req.admin._id)
  }
  if (files.gallery?.length) {
    const uploaded = await Promise.all(files.gallery.map((f) => uploadBuffer(f.buffer, { folder: 'roofing-cms/services/gallery' })))
    payload.gallery = uploaded.map((u) => ({ url: u.secure_url, publicId: u.public_id, alt: '' }))
    await Promise.all(uploaded.map((u) => trackMedia(u, req.admin._id)))
  }
  const service = await Service.create(payload)
  res.status(201).json(new ApiResponse(201, service, 'Service created'))
})

export const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id)
  if (!service) throw ApiError.notFound('Service not found')
  if (req.body.pricing !== undefined) req.body.pricing = parseJsonField(req.body.pricing)
  const files = req.files || {}
  if (files.coverImage?.[0]) {
    if (service.coverImage?.publicId) await deleteAsset(service.coverImage.publicId).catch(() => null)
    const uploaded = await uploadBuffer(files.coverImage[0].buffer, { folder: 'roofing-cms/services' })
    req.body.coverImage = { url: uploaded.secure_url, publicId: uploaded.public_id, alt: req.body.title || service.title }
    await trackMedia(uploaded, req.admin._id)
  }
  if (files.gallery?.length) {
    const uploaded = await Promise.all(files.gallery.map((f) => uploadBuffer(f.buffer, { folder: 'roofing-cms/services/gallery' })))
    req.body.gallery = [...service.gallery, ...uploaded.map((u) => ({ url: u.secure_url, publicId: u.public_id, alt: '' }))]
    await Promise.all(uploaded.map((u) => trackMedia(u, req.admin._id)))
  }
  Object.assign(service, req.body)
  await service.save()
  res.status(200).json(new ApiResponse(200, service, 'Service updated'))
})

export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id)
  if (!service) throw ApiError.notFound('Service not found')
  const images = [service.coverImage, ...(service.gallery || [])].filter(Boolean)
  await Promise.all(images.map((img) => deleteAsset(img.publicId).catch(() => null)))
  res.status(200).json(new ApiResponse(200, null, 'Service deleted'))
})

export const reorderServices = asyncHandler(async (req, res) => {
  const { order } = req.body
  await Promise.all(order.map(({ id, order: pos }) => Service.findByIdAndUpdate(id, { order: pos })))
  const docs = await Service.find().sort('order')
  res.status(200).json(new ApiResponse(200, docs, 'Service order updated'))
})
