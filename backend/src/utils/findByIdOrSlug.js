/**
 * Several public-facing routes are dual-purpose: the public site requests
 * a record by its human-readable `slug` (e.g. /services/roof-inspection),
 * while the admin dashboard's edit forms request the SAME route by the
 * record's MongoDB `_id` (since that's what the list/table view has).
 *
 * Without this, admin edit forms silently fail to load existing data:
 * the lookup only ever matches on `slug`, a raw ObjectId string never
 * matches any real slug, the request 404s, and the edit form just shows
 * its empty default values with no visible error.
 *
 * `crudFactory.js`'s generic getOne already handles this correctly for
 * Category/Testimonial/Faq — this is the same logic for the bespoke
 * Blog/Project/Service/Gallery controllers that don't use crudFactory.
 */
export function idOrSlugFilter(param) {
  return /^[0-9a-fA-F]{24}$/.test(param) ? { _id: param } : { slug: param }
}
