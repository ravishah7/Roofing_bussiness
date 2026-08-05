export function normalizeService(s) {
  return {
    id: s._id || s.title,
    title: s.title,
    slug: s.slug,
    shortDescription: s.shortDescription ?? s.desc,
    description: s.description ?? s.desc,
    icon: s.icon,
    img: s.coverImage?.url,
    gallery: s.gallery ?? [],
    pricing: s.pricing,
    features: s.features ?? [],
    seo: s.seo,
  }
}

export function formatPricing(pricing) {
  if (!pricing || pricing.type === 'quote') return 'Quote on request'
  const unit = pricing.unit && pricing.unit !== 'project' ? ` / ${pricing.unit}` : ''
  if (pricing.type === 'fixed') return pricing.minPrice ? `$${pricing.minPrice.toLocaleString()}${unit}` : 'Quote on request'
  if (pricing.type === 'range') {
    if (pricing.minPrice && pricing.maxPrice) return `$${pricing.minPrice.toLocaleString()} – $${pricing.maxPrice.toLocaleString()}${unit}`
    if (pricing.minPrice) return `From $${pricing.minPrice.toLocaleString()}${unit}`
  }
  return 'Quote on request'
}
