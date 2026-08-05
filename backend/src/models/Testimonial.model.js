import mongoose from 'mongoose'
import { imageSchema } from './seoSubschema.js'

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    location: { type: String, trim: true, maxlength: 100 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
    image: imageSchema,
    videoUrl: { type: String, trim: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

testimonialSchema.index({ status: 1, isFeatured: 1, order: 1 })

export default mongoose.model('Testimonial', testimonialSchema)
