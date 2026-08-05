/**
 * Multipart/form-data (multer) always delivers non-file fields as plain
 * strings — there's no way to send a real nested object or array over
 * multipart the way a JSON request body can. Frontend forms that need to
 * submit a nested field (e.g. Project's `location`, Service's `pricing`)
 * alongside a file upload have to JSON.stringify it first.
 *
 * Mongoose does NOT error on this mismatch — assigning a raw string to an
 * object/array-typed schema path is silently discarded (cast failure that
 * doesn't throw), so the field just vanishes with no error anywhere. This
 * parses it back if (and only if) it actually arrived as a JSON string,
 * and leaves it alone if it's already an object/array (the plain-JSON
 * request path, when no file is attached).
 */
export function parseJsonField(value) {
  if (typeof value !== 'string') return value
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}
