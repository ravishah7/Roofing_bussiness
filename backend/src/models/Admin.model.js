import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ['super_admin', 'admin', 'editor'], default: 'editor' },
    avatar: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },

    emailVerificationToken: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },

    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },

    refreshTokens: [
      {
        token: { type: String, select: false },
        userAgent: String,
        ip: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],

    lastLoginAt: Date,
    passwordChangedAt: Date,
  },
  { timestamps: true }
)

// No explicit adminSchema.index({ email: 1 }) here — `unique: true` on the
// email field above already creates that index; adding both causes a
// duplicate-index warning from Mongoose at startup.

// NOTE: this must be a plain async function with NO `next` parameter.
// Mixing `async` with a callback-style `next` argument confuses Mongoose's
// hook dispatcher (Kareem) — it can't tell whether to wait for the
// returned promise or for next() to be called, and next ends up not
// being a usable callback (`TypeError: next is not a function`).
// An async pre-hook signals completion by resolving/rejecting its
// promise, not by calling next().
adminSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 12)
  if (!this.isNew) this.passwordChangedAt = new Date(Date.now() - 1000)
})

adminSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password)
}

adminSchema.methods.changedPasswordAfter = function changedPasswordAfter(jwtTimestamp) {
  if (!this.passwordChangedAt) return false
  const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000)
  return jwtTimestamp < changedTimestamp
}

adminSchema.methods.createEmailVerificationToken = function createEmailVerificationToken() {
  const rawToken = crypto.randomBytes(32).toString('hex')
  this.emailVerificationToken = crypto.createHash('sha256').update(rawToken).digest('hex')
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000 // 24h
  return rawToken
}

adminSchema.methods.createPasswordResetToken = function createPasswordResetToken() {
  const rawToken = crypto.randomBytes(32).toString('hex')
  this.passwordResetToken = crypto.createHash('sha256').update(rawToken).digest('hex')
  this.passwordResetExpires = Date.now() + 60 * 60 * 1000 // 1h
  return rawToken
}

adminSchema.methods.toSafeObject = function toSafeObject() {
  const obj = this.toObject()
  delete obj.password
  delete obj.refreshTokens
  delete obj.emailVerificationToken
  delete obj.emailVerificationExpires
  delete obj.passwordResetToken
  delete obj.passwordResetExpires
  return obj
}

export default mongoose.model('Admin', adminSchema)
