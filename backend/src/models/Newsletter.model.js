import mongoose from 'mongoose'

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    status: { type: String, enum: ['subscribed', 'unsubscribed'], default: 'subscribed', index: true },
    unsubscribeToken: { type: String, select: false },
    subscribedAt: { type: Date, default: Date.now },
    unsubscribedAt: Date,
  },
  { timestamps: true }
)

export default mongoose.model('Newsletter', newsletterSchema)
