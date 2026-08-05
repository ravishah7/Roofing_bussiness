import mongoose from 'mongoose'

const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true, unique: true },
    fileName: { type: String },
    format: { type: String },
    resourceType: { type: String, enum: ['image', 'video', 'raw'], default: 'image' },
    size: { type: Number }, // bytes
    width: Number,
    height: Number,
    folder: { type: String, default: 'roofing-cms', index: true },
    alt: { type: String, default: '' },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
)

mediaSchema.index({ folder: 1, createdAt: -1 })

export default mongoose.model('Media', mediaSchema)
