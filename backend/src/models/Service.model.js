import mongoose from 'mongoose'
import slugify from 'slugify'
import { seoSchema, imageSchema } from './seoSubschema.js'

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, unique: true, lowercase: true, index: true },
    shortDescription: { type: String, trim: true, maxlength: 250 },
    description: { type: String, required: true },
    icon: { type: String, trim: true, default: 'Home' }, // lucide-react icon name
    coverImage: imageSchema,
    gallery: [imageSchema],
    pricing: {
      type: { type: String, enum: ['fixed', 'range', 'quote'], default: 'quote' },
      minPrice: Number,
      maxPrice: Number,
      unit: { type: String, default: 'project' }, // e.g. sq ft, project
      note: String,
    },
    features: [{ type: String, trim: true }],
    order: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    seo: seoSchema,
  },
  { timestamps: true }
)

serviceSchema.index({ status: 1, order: 1 })

// NOTE: no `next` param — see Blog.model.js for why (Mongoose 9's Kareem
// never passes one; calling next() throws TypeError).
serviceSchema.pre('validate', function generateSlug() {
  if (this.title && (this.isModified('title') || !this.slug)) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }
})

export default mongoose.model('Service', serviceSchema)
