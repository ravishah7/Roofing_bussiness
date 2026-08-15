
const PATTERNS = [
  /(?:youtube\.com\/watch\?v=)([^&?/]+)/,
  /(?:youtu\.be\/)([^?&/]+)/,
  /(?:youtube\.com\/embed\/)([^?&/]+)/,
  /(?:youtube\.com\/shorts\/)([^?&/]+)/,
]
 
/** Extracts the 11-char video ID from any YouTube URL. Returns null if not a YouTube URL. */
export function getYoutubeId(url) {
  if (!url || typeof url !== 'string') return null
  for (const pattern of PATTERNS) {
    const match = url.match(pattern)
    if (match?.[1]) return match[1]
  }
  return null
}
 
/** Auto-generated thumbnail — no API key required. */
export function getYoutubeThumbnail(url, quality = 'hqdefault') {
  const id = getYoutubeId(url)
  return id ? `https://i.ytimg.com/vi/${id}/${quality}.jpg` : null
}
 
export function isValidYoutubeUrl(url) {
  return !!getYoutubeId(url)
}
 