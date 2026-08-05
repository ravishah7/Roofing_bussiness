import multer from 'multer'
import ApiError from '../utils/ApiError.js'

// Memory storage — buffers are streamed straight to Cloudinary,
// never written to local disk.
const storage = multer.memoryStorage()

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']

function fileFilter(req, file, cb) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    return cb(ApiError.badRequest(`Unsupported file type: ${file.mimetype}`))
  }
  cb(null, true)
}

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024, files: 20 }, // 8MB per file
})
