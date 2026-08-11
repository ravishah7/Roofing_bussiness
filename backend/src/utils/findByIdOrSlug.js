export function idOrSlugFilter(param) {
  return /^[0-9a-fA-F]{24}$/.test(param) ? { _id: param } : { slug: param }
}
