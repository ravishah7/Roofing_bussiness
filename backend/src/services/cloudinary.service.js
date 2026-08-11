import cloudinary from '../config/cloudinary.js'
import streamifier from 'streamifier'

export function uploadBuffer(buffer, { folder = 'roofing-cms', resourceType = 'image' } = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        fetch_format: 'auto',
        quality: 'auto',
        disable_promises: true,
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    )
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
