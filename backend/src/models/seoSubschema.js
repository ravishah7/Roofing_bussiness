import mongoose from 'mongoose'

// Shared SEO fields reused across Blog, Project, Service, and Settings.
export const seoSchema = new mongoose.Schema(
  {
    metaTitle: { type: String, trim: true, maxlength: 70 },
    metaDescription: { type: String, trim: true, maxlength: 160 },
    keywords: [{ type: String, trim: true }],
    canonicalUrl: { type: String, trim: true },
    ogTitle: { type: String, trim: true },
    ogDescription: { type: String, trim: true },
    ogImage: { type: String, trim: true },
    twitterTitle: { type: String, trim: true },
    twitterDescription: { type: String, trim: true },
    twitterImage: { type: String, trim: true },
    noIndex: { type: Boolean, default: false },
    noFollow: { type: Boolean, default: false },
    schema: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false }
)

export const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    alt: { type: String, default: '' },
  },
  { _id: false }
)
