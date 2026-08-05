/**
 * Standalone Cloudinary connectivity/credentials check — completely
 * isolated from the rest of the app (no Express, no Multer, no
 * upload_stream). Run this directly:
 *
 *   node scripts/checkCloudinary.js
 *
 * It reads the same .env your server uses, and calls Cloudinary's own
 * .ping() endpoint — the simplest possible "are these credentials
 * valid" check Cloudinary provides. If this fails, the problem is
 * definitely your Cloudinary account/credentials/network, not our
 * application code (since none of our app code runs here at all).
 */
import dotenv from 'dotenv'
dotenv.config()

import { v2 as cloudinary } from 'cloudinary'

const cloudName = process.env.CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

console.log('--- Cloudinary config being used ---')
console.log('CLOUDINARY_CLOUD_NAME:', cloudName || '(missing!)')
console.log('CLOUDINARY_API_KEY:', apiKey ? apiKey.slice(0, 4) + '...' + apiKey.slice(-2) : '(missing!)')
console.log('CLOUDINARY_API_SECRET:', apiSecret ? apiSecret.slice(0, 4) + '...' + apiSecret.slice(-2) : '(missing!)')
console.log('CLOUDINARY_API_SECRET length:', apiSecret?.length ?? 0)
console.log('Any leading/trailing whitespace or quotes in secret?', apiSecret !== apiSecret?.trim() || /^["']|["']$/.test(apiSecret ?? '') ? 'YES — THIS IS LIKELY THE BUG' : 'no')
console.log('')

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
})

console.log('--- Calling cloudinary.api.ping() ---')
try {
  const result = await cloudinary.api.ping()
  console.log('SUCCESS — credentials are valid:', result)
} catch (err) {
  console.log('FAILED — Cloudinary rejected these credentials.')
  console.log('Full error:', JSON.stringify(err, null, 2))
  process.exit(1)
}

console.log('')
console.log('--- Calling cloudinary.uploader.upload() with a tiny test image ---')
console.log('(ping succeeding does NOT guarantee upload works — scoped/restricted')
console.log(' API keys can allow ping but block upload or usage() specifically)')
try {
  const pngBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
  const result = await cloudinary.uploader.upload(`data:image/png;base64,${pngBase64}`, {
    folder: 'roofing-cms/_diagnostic-test',
  })
  console.log('SUCCESS — upload works:', result.secure_url)
  console.log('(You can safely delete this test image from Cloudinary\'s Media Library)')
} catch (err) {
  console.log('FAILED — this API key cannot upload. Full error:', JSON.stringify(err, null, 2))
  console.log('')
  console.log('This confirms a scoped/restricted API key. Generate a new, unrestricted')
  console.log('API key in Cloudinary Settings → API Keys, and use that instead.')
}
