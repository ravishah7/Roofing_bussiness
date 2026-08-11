import Settings from '../models/Settings.model.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import { uploadBuffer, deleteAsset } from '../services/cloudinary.service.js'

/**
 * GET /settings — public (site needs it for header/footer/contact info)
 */
export const getSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.getSingleton().then
    ? await Settings.getSingleton()
    : Settings.getSingleton()
  const populated = await Settings.findById(settings._id).populate('homeBeforeAfter', 'title slug beforeImages afterImages')
  res.status(200).json(new ApiResponse(200, populated, 'Settings fetched'))
})

/**
 * PATCH /settings — admin only, deep-merges nested sections
 */
export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.getSingleton()

  const sections = ['business', 'social', 'analytics', 'cookieBanner', 'theme', 'seo']
  sections.forEach((key) => {
    if (req.body[key]) {
      settings[key] = { ...settings[key]?.toObject?.() ?? settings[key], ...req.body[key] }
    }
  })
  if (typeof req.body.maintenanceMode === 'boolean') {
    settings.maintenanceMode = req.body.maintenanceMode
  }

  await settings.save()
  res.status(200).json(new ApiResponse(200, settings, 'Settings updated'))
})

/**
 * PATCH /settings/logo — multipart, field "logo"
 */
export const updateLogo = asyncHandler(async (req, res) => {
  const settings = await Settings.getSingleton()

  if (settings.logo?.publicId) await deleteAsset(settings.logo.publicId).catch(() => null)

  const uploaded = await uploadBuffer(req.file.buffer, { folder: 'roofing-cms/branding' })
  settings.logo = { url: uploaded.secure_url, publicId: uploaded.public_id }
  await settings.save()

  res.status(200).json(new ApiResponse(200, settings, 'Logo updated'))
})

/**
 * PATCH /settings/favicon — multipart, field "favicon"
 */
export const updateFavicon = asyncHandler(async (req, res) => {
  const settings = await Settings.getSingleton()

  if (settings.favicon?.publicId) await deleteAsset(settings.favicon.publicId).catch(() => null)

  const uploaded = await uploadBuffer(req.file.buffer, { folder: 'roofing-cms/branding' })
  settings.favicon = { url: uploaded.secure_url, publicId: uploaded.public_id }
  await settings.save()

  res.status(200).json(new ApiResponse(200, settings, 'Favicon updated'))
})

export const setHomeBeforeAfter = asyncHandler(async (req, res) => {
  const { projectId } = req.body
  const Settings = (await import('../models/Settings.model.js')).default
  const settings = await Settings.findOneAndUpdate(
    {},
    { homeBeforeAfter: projectId || null },
    { new: true, upsert: true }
  )
  res.status(200).json(new ApiResponse(200, settings, 'Home before/after slider updated'))
})
