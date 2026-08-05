import { Star, Quote, MessageSquareOff } from 'lucide-react'
import Seo from '@/components/Seo'
import PageHero from '@/components/ui/PageHero'
import Container from '@/components/ui/Container'
import FinalCta from '@/components/home/FinalCta'
import { useResourceList } from '@/hooks/useContentQueries'
import { TESTIMONIALS as FALLBACK_TESTIMONIALS } from '@/data/site'

export default function TestimonialsPage() {
  const { data, isLoading, isError } = useResourceList('testimonials', { limit: 50, sort: '-isFeatured,-createdAt' })

  const live = data?.data
  const showFallback = isError || (!isLoading && (!live || live.length === 0))
  const testimonials = live?.length ? live : showFallback ? FALLBACK_TESTIMONIALS : []
  const showSkeleton = isLoading && testimonials.length === 0

  return (
    <>
      <Seo title="Customer Reviews" description="Read what homeowners say about our roofing work." path="/testimonials" />
      <PageHero eyebrow="Reviews" title="What our customers are saying." crumb="Testimonials" />
      <section className="bg-white py-20 dark:bg-ink-950 md:py-28">
        <Container>
          {showSkeleton ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 animate-pulse rounded-3xl border border-ink-100 bg-ink-50 dark:border-ink-800 dark:bg-ink-900/40" />
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <MessageSquareOff className="h-10 w-10 text-ink-300 dark:text-ink-600" />
              <p className="mt-4 text-ink-500 dark:text-ink-400">No reviews published yet — check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {testimonials.map((t) => (
                <div key={t._id || t.name} className="rounded-3xl border border-ink-100 p-8 dark:border-ink-800">
                  <Quote className="h-7 w-7 text-ember-500" />
                  <div className="mt-3 flex gap-0.5">
                    {[...Array(t.rating)].map((_, j) => <Star key={j} className="h-4 w-4 fill-ember-500 text-ember-500" />)}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-ink-600 dark:text-ink-400">{t.text}</p>
                  <p className="mt-5 font-semibold text-ink-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-ink-500 dark:text-ink-400">{t.location}</p>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>
      <FinalCta />
    </>
  )
}
