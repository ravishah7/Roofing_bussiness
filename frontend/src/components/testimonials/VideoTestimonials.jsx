import { useState } from 'react'
import { Star, Play, Quote } from 'lucide-react'
import { getYoutubeThumbnail, getYoutubeEmbedUrl } from '@/lib/youtube'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
 
/**
 * Featured video testimonial player + switchable thumbnail strip.
 * `videos` = testimonials that have a valid videoUrl.
 *
 * Click-to-play: the featured video shows a poster (thumbnail + play button)
 * until clicked, so we don't silently load a YouTube iframe (and its
 * tracking/cookies/network weight) for every visitor on page load.
 * Switching the active video via a thumbnail auto-plays the new selection,
 * since clicking a specific video is already an explicit "play this" intent.
 */
export default function VideoTestimonials({ videos = [] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
 
  if (!videos.length) return null
 
  const active = videos[activeIndex]
  const poster = getYoutubeThumbnail(active.videoUrl, 'maxresdefault')
  const embedUrl = getYoutubeEmbedUrl(active.videoUrl, { autoplay: true })
 
  const selectVideo = (index) => {
    setActiveIndex(index)
    setPlaying(true)
  }
 
  return (
    <section className="bg-ink-50 py-20 dark:bg-ink-900/40 md:py-28">
      <Container>
        <SectionHeading eyebrow="In their own words" title="Hear it straight from our customers" />
 
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Featured player */}
          <div className="lg:col-span-2">
            <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-ink-950 shadow-lg">
              {playing && embedUrl ? (
                <iframe
                  key={active._id || active.videoUrl}
                  src={embedUrl}
                  title={`Video testimonial from ${active.name}`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  className="group relative h-full w-full"
                  aria-label={`Play video testimonial from ${active.name}`}
                >
                  {poster && (
                    <img src={poster} alt="" className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-60" />
                  )}
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ember-500 text-white shadow-xl transition-transform group-hover:scale-110">
                      <Play className="h-6 w-6 translate-x-0.5 fill-current" />
                    </span>
                  </span>
                </button>
              )}
            </div>
 
            <div className="mt-5 flex items-start gap-3">
              <Quote className="mt-1 h-5 w-5 shrink-0 text-ember-500" />
              <div>
                <p className="text-ink-700 dark:text-ink-300">{active.text}</p>
                <div className="mt-2 flex items-center gap-2">
                  <p className="font-semibold text-ink-900 dark:text-white">{active.name}</p>
                  {active.location && <span className="text-sm text-ink-400">· {active.location}</span>}
                  <span className="flex gap-0.5">
                    {[...Array(active.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-ember-500 text-ember-500" />
                    ))}
                  </span>
                </div>
              </div>
            </div>
          </div>
 
          {/* Thumbnail strip */}
          <div className="flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {videos.map((video, index) => {
              const thumb = getYoutubeThumbnail(video.videoUrl)
              const isActive = index === activeIndex
              return (
                <button
                  key={video._id || video.videoUrl}
                  type="button"
                  onClick={() => selectVideo(index)}
                  className={`flex w-40 shrink-0 items-center gap-3 rounded-2xl border p-2 text-left transition-colors lg:w-full ${
                    isActive
                      ? 'border-ember-500 bg-white dark:bg-ink-950'
                      : 'border-transparent hover:border-ink-200 dark:hover:border-ink-700'
                  }`}
                >
                  <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-ink-200 dark:bg-ink-800">
                    {thumb && <img src={thumb} alt="" className="h-full w-full object-cover" />}
                    <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Play className="h-4 w-4 fill-white text-white" />
                    </span>
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-ink-900 dark:text-white">{video.name}</span>
                    {video.location && (
                      <span className="block truncate text-xs text-ink-400">{video.location}</span>
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
 