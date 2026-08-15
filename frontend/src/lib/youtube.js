
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
 
/** youtube-nocookie.com embed URL (privacy-enhanced mode — no tracking cookie until played). */
export function getYoutubeEmbedUrl(url, { autoplay = true } = {}) {
  const id = getYoutubeId(url)
  if (!id) return null
  const params = new URLSearchParams({ rel: '0', modestbranding: '1' })
  if (autoplay) params.set('autoplay', '1')
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`
}
 
export function isValidYoutubeUrl(url) {
  return !!getYoutubeId(url)
}
 