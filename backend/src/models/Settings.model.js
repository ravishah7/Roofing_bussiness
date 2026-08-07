import mongoose from 'mongoose'
import { seoSchema } from './seoSubschema.js'

/**
 * Singleton document — a single Settings row holds all site-wide config.
 * Fetched/updated via a fixed key rather than an _id lookup.
 */
const settingsSchema = new mongoose.Schema(
  {
    singletonKey: { type: String, default: 'main', unique: true },
    homeBeforeAfter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    business: {
      name: { type: String, default: 'Summit Roof Co.' },
      tagline: { type: String, default: '' },
      phone: { type: String, default: '' },
      emergencyPhone: { type: String, default: '' },
      email: { type: String, default: '' },
      address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: { type: String, default: 'US' },
      },
      openingHours: [
        {
          day: { type: String },
          open: String,
          close: String,
          isClosed: { type: Boolean, default: false },
        },
      ],
      whatsappNumber: { type: String, default: '' },
      googleMapsUrl: { type: String, default: '' },
      calendlyUrl: { type: String, default: '' },
      licenseNumber: { type: String, default: '' },
    },

    social: {
      facebook: String,
      instagram: String,
      youtube: String,
      twitter: String,
      linkedin: String,
      tiktok: String,
    },

    analytics: {
      googleAnalyticsId: String,
      googleTagManagerId: String,
      facebookPixelId: String,
      googleSiteVerification: String,
      googlePlaceId: String, // for Google Reviews API
    },

    cookieBanner: {
      isEnabled: { type: Boolean, default: true },
      message: {
        type: String,
        default: 'We use cookies to improve your browsing experience and analyze site traffic.',
      },
      policyUrl: { type: String, default: '/privacy-policy' },
    },

    theme: {
      primaryColor: { type: String, default: '#FF6B00' },
      secondaryColor: { type: String, default: '#1B1D22' },
      accentColor: { type: String, default: '#1E5AA8' },
      defaultMode: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    },

    logo: {
      url: String,
      publicId: String,
    },
    favicon: {
      url: String,
      publicId: String,
    },

    seo: seoSchema,

    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true }
)

settingsSchema.statics.getSingleton = async function getSingleton() {
  let settings = await this.findOne({ singletonKey: 'main' })
  if (!settings) {
    settings = await this.create({ singletonKey: 'main' })
  }
  return settings
}

export default mongoose.model('Settings', settingsSchema)
