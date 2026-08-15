import { Star, Quote, MessageSquareOff } from 'lucide-react'
import Seo from '@/components/Seo'
import PageHero from '@/components/ui/PageHero'
import Container from '@/components/ui/Container'
import FinalCta from '@/components/home/FinalCta'
import VideoTestimonials from '@/components/testimonials/VideoTestimonials'
import { useResourceList } from '@/hooks/useContentQueries'
import { isValidYoutubeUrl } from '@/lib/youtube'
import { TESTIMONIALS as FALLBACK_TESTIMONIALS } from '@/data/site'
import Testimonials from '@/components/home/Testimonials'

export default function TestimonialsPage() {
  const { data, isLoading, isError } = useResourceList('testimonials', { limit: 50, sort: '-isFeatured,-createdAt' })

  const live = data?.data
  const showFallback = isError || (!isLoading && (!live || live.length === 0))
  const testimonials = live?.length ? live : showFallback ? FALLBACK_TESTIMONIALS : []
  const showSkeleton = isLoading && testimonials.length === 0

  const DEV_TEST_VIDEOS = [
    { _id: 'test-1', name: 'Marianne Cole', location: 'Oak Park, IL', rating: 5, text: 'From the first inspection to the final walkthrough, the crew was precise and professional.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { _id: 'test-2', name: 'David Huang', location: 'Naperville, IL', rating: 5, text: 'They handled our entire insurance claim after the hailstorm — zero stress on our end.', videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw' },
    { _id: 'test-3', name: 'Priya Shah', location: 'Evanston, IL', rating: 5, text: 'Best contractor experience we have had on any home project, start to finish.', videoUrl: 'https://youtu.be/L_jWHffIx5E' },
  ]
  const allTestimonials = import.meta.env.DEV ? [...DEV_TEST_VIDEOS, ...testimonials] : testimonials

  const videoTestimonials = allTestimonials.filter((t) => isValidYoutubeUrl(t.videoUrl))
  const textTestimonials = allTestimonials.filter((t) => !isValidYoutubeUrl(t.videoUrl))

  return (
    <>
      <Seo title="Customer Reviews" description="Read what homeowners say about our roofing work." path="/testimonials" />
      <PageHero eyebrow="Reviews" title="What our customers are saying." crumb="Testimonials" />

      {!showSkeleton && videoTestimonials.length > 0 && <VideoTestimonials videos={videoTestimonials} />}

      <Testimonials  />  
      <FinalCta />
    </>
  )
}