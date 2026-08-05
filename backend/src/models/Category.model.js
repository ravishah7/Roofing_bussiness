import mongoose from 'mongoose'
import slugify from 'slugify'

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true, maxlength: 60 },
    slug: { type: String, unique: true, lowercase: true, index: true },
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

// NOTE: no `next` param — see Blog.model.js for why (Mongoose 9's Kareem
// never passes one; calling next() throws TypeError).
categorySchema.pre('validate', function generateSlug() {
  if (this.name && (this.isModified('name') || !this.slug)) {
    this.slug = slugify(this.name, { lower: true, strict: true })
  }
})

export default mongoose.model('Category', categorySchema)
