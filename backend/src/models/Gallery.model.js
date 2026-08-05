import mongoose from 'mongoose'
import slugify from 'slugify'
import { imageSchema } from './seoSubschema.js'

const galleryImageSchema = new mongoose.Schema(
  {
    ...imageSchema.obj,
    caption: { type: String, trim: true },
  },
  { _id: true }
)

const albumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    slug: { type: String, unique: true, lowercase: true, index: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    description: { type: String, trim: true, maxlength: 500 },
    coverImage: imageSchema,
    images: [galleryImageSchema],
    status: { type: String, enum: ['draft', 'published'], default: 'published', index: true },
  },
  { timestamps: true }
)

// NOTE: no `next` param — see Blog.model.js for why (Mongoose 9's Kareem
// never passes one; calling next() throws TypeError).
albumSchema.pre('validate', function generateSlug() {
  if (this.title && (this.isModified('title') || !this.slug)) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }
})

export default mongoose.model('Album', albumSchema)
