import mongoose from 'mongoose'
import slugify from 'slugify'
import { seoSchema, imageSchema } from './seoSubschema.js'

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    slug: { type: String, unique: true, lowercase: true, index: true },
    description: { type: String, required: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    servicesUsed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    location: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      address: { type: String, trim: true },
      lat: Number,
      lng: Number,
    },
    coverImage: imageSchema,
    gallery: [imageSchema],
    beforeImages: [imageSchema],
    afterImages: [imageSchema],
    completionDate: { type: Date },
    customerReview: {
      name: String,
      rating: { type: Number, min: 1, max: 5 },
      text: String,
    },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    isFeatured: { type: Boolean, default: false },
    seo: seoSchema,
  },
  { timestamps: true }
)

projectSchema.index({ title: 'text', description: 'text' })
projectSchema.index({ status: 1, isFeatured: 1, completionDate: -1 })

// NOTE: no `next` param — see Blog.model.js for why (Mongoose 9's Kareem
// never passes one; calling next() throws TypeError).
projectSchema.pre('validate', function generateSlug() {
  if (this.title && (this.isModified('title') || !this.slug)) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }
})

export default mongoose.model('Project', projectSchema)
