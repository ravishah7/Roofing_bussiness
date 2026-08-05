import mongoose from 'mongoose'

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true, maxlength: 250 },
    answer: { type: String, required: true, trim: true, maxlength: 2000 },
    category: { type: String, trim: true, default: 'General' },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
)

faqSchema.index({ order: 1 })

export default mongoose.model('Faq', faqSchema)
