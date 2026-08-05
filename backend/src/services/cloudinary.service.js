import cloudinary from '../config/cloudinary.js'
import streamifier from 'streamifier'

/**
 * Uploads a buffer (from multer memoryStorage) to Cloudinary with
 * automatic format/quality optimization.
 */
export function uploadBuffer(buffer, { folder = 'roofing-cms', resourceType = 'image' } = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        fetch_format: 'auto',
        quality: 'auto',
        // Per Cloudinary's own docs: when you use the callback style
        // (as we do here), their SDK ALSO builds its own internal
        // promise around the same call. If Cloudinary's servers reject
        // the upload, that internal promise can reject with nothing to
        // .catch() it — from OUR code's perspective, not even a bug,
        // just an unreachable rejection inside their SDK's internals.
        // This flag tells their SDK to skip building that redundant
        // internal promise, since we already handle the result/error
        // ourselves via the callback below.
        // NOTE: verified against node_modules/cloudinary/lib/uploader.js
        // — the actual flag is `disable_promises` (plural), not the
        // singular `disable_promise` some docs/blog posts show.
        disable_promises: true,
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    )

    // CRITICAL: a Node stream that emits an 'error' event with no
    // listener attached crashes the entire process (an EventEmitter
    // 'error' with no handler throws, uncatchable by try/catch or
    // asyncHandler). Cloudinary's upload_stream can emit 'error' on
    // this stream in addition to (or instead of) calling the callback
    // above — e.g. on an auth/permissions failure from Cloudinary's API.
    // Without these listeners, a bad Cloudinary API key/secret doesn't
    // just fail the one request, it takes the whole server down.
    uploadStream.on('error', reject)

    const readStream = streamifier.createReadStream(buffer)
    readStream.on('error', reject)
    readStream.pipe(uploadStream)
  })
}

export async function deleteAsset(publicId, resourceType = 'image') {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
}

export default { uploadBuffer, deleteAsset }
