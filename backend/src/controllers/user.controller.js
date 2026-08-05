import Admin from '../models/Admin.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import ApiFeatures from '../utils/apiFeatures.js'
import { uploadBuffer, deleteAsset } from '../services/cloudinary.service.js'

/**
 * GET /users — super_admin only
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(Admin.find(), req.query)
    .filter()
    .search(['name', 'email'])
    .sort('-createdAt')
    .limitFields()
    .paginate()

  const docs = await features.query.lean()
  const meta = await features.getMeta(Admin)
  res.status(200).json(new ApiResponse(200, docs, 'Users fetched', meta))
})

export const getUserById = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.params.id)
  if (!admin) throw ApiError.notFound('User not found')
  res.status(200).json(new ApiResponse(200, admin, 'User fetched'))
})

/**
 * PATCH /users/:id — super_admin only: role, isActive, name
 */
export const updateUser = asyncHandler(async (req, res) => {
  const { name, role, isActive } = req.body

  if (req.params.id === req.admin._id.toString() && isActive === false) {
    throw ApiError.badRequest('You cannot deactivate your own account')
  }

  const admin = await Admin.findByIdAndUpdate(
    req.params.id,
    { ...(name && { name }), ...(role && { role }), ...(typeof isActive === 'boolean' && { isActive }) },
    { new: true, runValidators: true }
  )
  if (!admin) throw ApiError.notFound('User not found')

  res.status(200).json(new ApiResponse(200, admin.toSafeObject(), 'User updated'))
})

export const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.admin._id.toString()) {
    throw ApiError.badRequest('You cannot delete your own account')
  }

  const admin = await Admin.findByIdAndDelete(req.params.id)
  if (!admin) throw ApiError.notFound('User not found')

  if (admin.avatar?.publicId) await deleteAsset(admin.avatar.publicId).catch(() => null)

  res.status(200).json(new ApiResponse(200, null, 'User deleted'))
})

/**
 * PATCH /users/me/avatar — any authenticated admin updates their own avatar
 */
export const updateMyAvatar = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id)
  if (admin.avatar?.publicId) await deleteAsset(admin.avatar.publicId).catch(() => null)

  const uploaded = await uploadBuffer(req.file.buffer, { folder: 'roofing-cms/avatars' })
  admin.avatar = { url: uploaded.secure_url, publicId: uploaded.public_id }
  await admin.save({ validateBeforeSave: false })

  res.status(200).json(new ApiResponse(200, admin.toSafeObject(), 'Avatar updated'))
})

/**
 * PATCH /users/me — any authenticated admin updates their own name
 */
export const updateMe = asyncHandler(async (req, res) => {
  const admin = await Admin.findByIdAndUpdate(req.admin._id, { name: req.body.name }, { new: true, runValidators: true })
  res.status(200).json(new ApiResponse(200, admin.toSafeObject(), 'Profile updated'))
})
