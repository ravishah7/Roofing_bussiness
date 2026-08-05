export function normalizeAlbum(a) {
  return {
    id: a._id || a.title,
    title: a.title,
    slug: a.slug,
    description: a.description,
    category: typeof a.category === 'object' ? a.category?.name : a.category,
    img: a.coverImage?.url,
    images: (a.images ?? []).map((img) => ({ url: img.url, caption: img.caption })),
  }
}

// Used only if the gallery API is unreachable and there are genuinely no
// albums to show yet — keeps the page from rendering completely empty.
export function getFallbackAlbums(projects) {
  return [
    { id: 'fallback-1', title: 'Residential Roofing', slug: 'residential-roofing', category: 'Residential', img: projects[0]?.img, images: projects.slice(0, 3).map((p) => ({ url: p.img })) },
    { id: 'fallback-2', title: 'Commercial Projects', slug: 'commercial-projects', category: 'Commercial', img: projects[1]?.img, images: projects.slice(1, 4).map((p) => ({ url: p.img })) },
  ]
}
