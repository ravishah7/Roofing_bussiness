import mongoose from 'mongoose'
import slugify from 'slugify'
import { seoSchema, imageSchema } from './seoSubschema.js'

const commentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    isApproved: { type: Boolean, default: false },
    isSpam: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    slug: { type: String, unique: true, lowercase: true, index: true },
    excerpt: { type: String, trim: true, maxlength: 300 },
    content: { type: String, required: true }, // rich HTML/markdown content
    featuredImage: imageSchema,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    tags: [{ type: String, trim: true, lowercase: true }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft', index: true },
    publishedAt: { type: Date },
    readingTimeMinutes: { type: Number, default: 5 },
    views: { type: Number, default: 0 },
    comments: [commentSchema],
    seo: seoSchema,
  },
  { timestamps: true }
)

blogSchema.index({ title: 'text', excerpt: 'text', content: 'text' })
blogSchema.index({ status: 1, publishedAt: -1 })

// NOTE: no `next` parameter — this Mongoose/Kareem version never passes
// one to pre-hooks at all (it only awaits a returned Promise, or just
// proceeds once a synchronous function returns). The old `function(next)
// {...; next()}` callback style is dead code here: `next` is `undefined`,
// so calling it throws `TypeError: next is not a function`.
blogSchema.pre('validate', function generateSlug() {
  if (this.title && (this.isModified('title') || !this.slug)) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }
})

blogSchema.pre('save', function setPublishedAt() {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date()
  }
})

blogSchema.virtual('approvedComments').get(function getApprovedComments() {
  return this.comments.filter((c) => c.isApproved && !c.isSpam)
})

blogSchema.set('toJSON', { virtuals: true })

export default mongoose.model('Blog', blogSchema)
