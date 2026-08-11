import mongoose from 'mongoose'

// Shared SEO fields reused across Blog, Project, Service, and Settings.
export const seoSchema = new mongoose.Schema(
  {
    metaTitle: { type: String, trim: true, maxlength: 70 },
    metaDescription: { type: String, trim: true, maxlength: 160 },
    // Using Mixed instead of [String] to avoid a Mongoose 9 crash:
    // Mongoose 9 throws "Cannot read properties of undefined (reading
    // 'indexedPaths')" when it tries to apply defaults to an empty or
    // undefined [String] array path inside a subdocument schema.
    // Mixed sidesteps the subdocument array initialisation entirely;
    // the controller's normaliseSeo() always ensures this is a real
    // array before Mongoose ever casts it.
    keywords: { type: mongoose.Schema.Types.Mixed, default: [] },
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
