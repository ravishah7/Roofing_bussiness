import mongoose from 'mongoose'
import slugify from 'slugify'

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    slug: { type: String, lowercase: true, index: true },
    description: { type: String, trim: true, maxlength: 300 },
    type: {
      type: String,
      enum: ['blog', 'gallery', 'project'],
      default: 'blog',
      index: true,
    },
  },
  { timestamps: true }
)

// Compound unique: "Residential" can exist as both project + gallery
categorySchema.index({ name: 1, type: 1 }, { unique: true })

categorySchema.pre('validate', function generateSlug() {
  if (this.name && (this.isModified('name') || !this.slug)) {
    this.slug = slugify(this.name, { lower: true, strict: true })
  }
})

export default mongoose.model('Category', categorySchema)
