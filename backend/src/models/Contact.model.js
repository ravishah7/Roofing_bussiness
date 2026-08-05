import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, maxlength: 30 },
    service: { type: String, trim: true },
    message: { type: String, trim: true, maxlength: 3000 },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'resolved', 'spam'],
      default: 'new',
      index: true,
    },
    source: { type: String, default: 'website' },
    ipAddress: { type: String },
    userAgent: { type: String },
    notifiedAt: Date,
    repliedAt: Date,
  },
  { timestamps: true }
)

contactSchema.index({ createdAt: -1 })
contactSchema.index({ name: 'text', email: 'text', message: 'text' })

export default mongoose.model('Contact', contactSchema)
