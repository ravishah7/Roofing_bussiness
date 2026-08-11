import Album from '../models/Gallery.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import ApiFeatures from '../utils/apiFeatures.js'
import { uploadBuffer, deleteAsset } from '../services/cloudinary.service.js'
import { idOrSlugFilter } from '../utils/findByIdOrSlug.js'
import Media from '../models/Media.model.js'

async function trackMedia(uploaded, adminId) {
  try { await Media.create({ url: uploaded.secure_url, publicId: uploaded.public_id, fileName: uploaded.original_filename || uploaded.public_id.split('/').pop(), format: uploaded.format, resourceType: uploaded.resource_type, size: uploaded.bytes, width: uploaded.width, height: uploaded.height, folder: uploaded.folder || 'roofing-cms', uploadedBy: adminId }) } catch { }
}

export const getAllAlbums = asyncHandler(async (req, res) => {
  const baseFilter = req.admin ? {} : { status: 'published' }
  const features = new ApiFeatures(Album.find(baseFilter), req.query)
    .filter()
    .search(['title', 'description'])
    .sort('-createdAt')
    .limitFields()
    .paginate()

  const docs = await features.query.populate('category', 'name slug').lean()
  const meta = await features.getMeta(Album)
  res.status(200).json(new ApiResponse(200, docs, 'Albums fetched', meta))
})

export const getAlbumBySlug = asyncHandler(async (req, res) => {
  const filter = req.admin
    ? idOrSlugFilter(req.params.slug)
    : { ...idOrSlugFilter(req.params.slug), status: 'published' }
  const album = await Album.findOne(filter).populate('category', 'name slug')
  if (!album) throw ApiError.notFound('Album not found')
  res.status(200).json(new ApiResponse(200, album, 'Album fetched'))
})

export const createAlbum = asyncHandler(async (req, res) => {
  const payload = { ...req.body }
  const files = req.files || {}

  if (files.coverImage?.[0]) {
    const uploaded = await uploadBuffer(files.coverImage[0].buffer, { folder: 'roofing-cms/gallery' })
    payload.coverImage = { url: uploaded.secure_url, publicId: uploaded.public_id, alt: req.body.title }
    await trackMedia(uploaded, req.admin._id)
  }
  if (files.images?.length) {
    const uploaded = await Promise.all(files.images.map((f) => uploadBuffer(f.buffer, { folder: 'roofing-cms/gallery' })))
    payload.images = uploaded.map((u) => ({ url: u.secure_url, publicId: u.public_id, alt: '', caption: '' }))
    await Promise.all(uploaded.map((u) => trackMedia(u, req.admin._id)))
  }

  const album = await Album.create(payload)
  res.status(201).json(new ApiResponse(201, album, 'Album created'))
})

export const updateAlbum = asyncHandler(async (req, res) => {
  const album = await Album.findById(req.params.id)
  if (!album) throw ApiError.notFound('Album not found')

  const files = req.files || {}
  if (files.coverImage?.[0]) {
    if (album.coverImage?.publicId) await deleteAsset(album.coverImage.publicId).catch(() => null)
    const uploaded = await uploadBuffer(files.coverImage[0].buffer, { folder: 'roofing-cms/gallery' })
    req.body.coverImage = { url: uploaded.secure_url, publicId: uploaded.public_id, alt: req.body.title || album.title }
    await trackMedia(uploaded, req.admin._id)
  }
  if (files.images?.length) {
    const uploaded = await Promise.all(files.images.map((f) => uploadBuffer(f.buffer, { folder: 'roofing-cms/gallery' })))
    req.body.images = [...album.images, ...uploaded.map((u) => ({ url: u.secure_url, publicId: u.public_id, alt: '', caption: '' }))]
    await Promise.all(uploaded.map((u) => trackMedia(u, req.admin._id)))
  }

  Object.assign(album, req.body)
  await album.save()

  res.status(200).json(new ApiResponse(200, album, 'Album updated'))
})

export const deleteAlbum = asyncHandler(async (req, res) => {
  const album = await Album.findByIdAndDelete(req.params.id)
  if (!album) throw ApiError.notFound('Album not found')

  const images = [album.coverImage, ...(album.images || [])].filter(Boolean)
  await Promise.all(images.map((img) => deleteAsset(img.publicId).catch(() => null)))

  res.status(200).json(new ApiResponse(200, null, 'Album deleted'))
})

/**
 * DELETE /gallery/:id/images/:imageId — remove a single image from an album
 */
export const deleteAlbumImage = asyncHandler(async (req, res) => {
  const { id, imageId } = req.params
  const album = await Album.findById(id)
  if (!album) throw ApiError.notFound('Album not found')

  const image = album.images.id(imageId)
  if (!image) throw ApiError.notFound('Image not found in this album')

  await deleteAsset(image.publicId).catch(() => null)
  image.deleteOne()
  await album.save()

  res.status(200).json(new ApiResponse(200, album, 'Image removed from album'))
})
