import Media from '../models/Media.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import ApiFeatures from '../utils/apiFeatures.js'
import { uploadBuffer, deleteAsset } from '../services/cloudinary.service.js'

/**
 * POST /media/upload — multipart, field name "files" (array)
 */
export const uploadMedia = asyncHandler(async (req, res) => {
  const files = req.files || []
  if (!files.length) throw ApiError.badRequest('No files provided')

  const folder = req.body.folder || 'roofing-cms/library'

  const results = await Promise.all(
    files.map(async (file) => {
      const uploaded = await uploadBuffer(file.buffer, { folder })
      return Media.create({
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
        fileName: file.originalname,
        format: uploaded.format,
        resourceType: uploaded.resource_type,
        size: uploaded.bytes,
        width: uploaded.width,
        height: uploaded.height,
        folder,
        uploadedBy: req.admin._id,
      })
    })
  )

  res.status(201).json(new ApiResponse(201, results, `${results.length} file(s) uploaded`))
})

/**
 * GET /media — admin media library, paginated + filterable by folder
 */
export const getAllMedia = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(Media.find(), req.query)
    .filter()
    .search(['fileName', 'folder'])
    .sort('-createdAt')
    .limitFields()
    .paginate()

  const docs = await features.query.lean()
  const meta = await features.getMeta(Media)
  res.status(200).json(new ApiResponse(200, docs, 'Media fetched', meta))
})

export const getFolders = asyncHandler(async (req, res) => {
  const folders = await Media.distinct('folder')
  res.status(200).json(new ApiResponse(200, folders, 'Folders fetched'))
})

export const deleteMedia = asyncHandler(async (req, res) => {
  const media = await Media.findByIdAndDelete(req.params.id)
  if (!media) throw ApiError.notFound('Media asset not found')

  await deleteAsset(media.publicId, media.resourceType).catch(() => null)

  res.status(200).json(new ApiResponse(200, null, 'Media asset deleted'))
})
