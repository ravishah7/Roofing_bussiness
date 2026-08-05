// Normalizes a project record so display code doesn't need to branch on
// whether it came from the live API or the static fallback list — they
// use different shapes (category is a populated object vs a plain
// string, location is {city,state} vs a formatted string, etc).
export function normalizeProject(p) {
  const cityState = p.location?.city
    ? `${p.location.city}, ${p.location.state || ''}`.replace(/,\s*$/, '')
    : p.location

  return {
    id: p._id || p.title,
    title: p.title,
    slug: p.slug,
    description: p.description,
    category: typeof p.category === 'object' ? p.category?.name : p.category,
    categorySlug: typeof p.category === 'object' ? p.category?.slug : undefined,
    servicesUsed: Array.isArray(p.servicesUsed) ? p.servicesUsed.filter((s) => typeof s === 'object') : [],
    location: cityState,
    locationDetail: p.location,
    date: p.completionDate
      ? new Date(p.completionDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : p.date,
    completionDate: p.completionDate,
    img: p.coverImage?.url ?? p.img,
    gallery: p.gallery ?? [],
    beforeImages: p.beforeImages ?? [],
    afterImages: p.afterImages ?? [],
    customerReview: p.customerReview,
    isFeatured: !!p.isFeatured,
    seo: p.seo,
  }
}
