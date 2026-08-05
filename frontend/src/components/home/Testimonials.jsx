import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import { Star, Quote } from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import { useResourceList } from '@/hooks/useContentQueries'
import { TESTIMONIALS as FALLBACK_TESTIMONIALS } from '@/data/site'
import 'swiper/css'
import 'swiper/css/pagination'

export default function Testimonials() {
  // Public GET /testimonials only ever returns approved ones (the backend
  // enforces that for non-admin requests) — no status filter needed here.
  const { data, isLoading, isError } = useResourceList('testimonials', { limit: 9, sort: '-isFeatured,-createdAt' })

  const live = data?.data
  // `testimonials` must always resolve to an array — never null/undefined —
  // so .map() below can't blow up regardless of the exact loading/error
  // timing. Falls back to the sample reviews once we're done loading and
  // either the request failed or genuinely came back empty.
  const showFallback = isError || (!isLoading && (!live || live.length === 0))
  const testimonials = live?.length ? live : showFallback ? FALLBACK_TESTIMONIALS : []
  const showSkeleton = isLoading && testimonials.length === 0

  return (
    <section className="bg-ink-50 py-24 dark:bg-ink-950 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Customer Reviews"
          title="Homeowners trust us with the roof over their heads."
          align="center"
          className="mx-auto"
        />

        <div className="mt-14">
          {showSkeleton ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-56 animate-pulse rounded-3xl border border-ink-100 bg-white dark:border-white/10 dark:bg-white/5" />
              ))}
            </div>
          ) : (
            <Swiper
              modules={[Autoplay, Pagination]}
              slidesPerView={1}
              spaceBetween={24}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
              className="!pb-12"
            >
              {testimonials.map((t) => (
                <SwiperSlide key={t._id || t.name}>
                  <div className="flex h-full flex-col rounded-3xl border border-ink-100 bg-white p-8 shadow-sm shadow-ink-900/5 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                    <Quote className="h-8 w-8 text-ember-500" />
                    <div className="mt-4 flex gap-0.5">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-ember-500 text-ember-500" />
                      ))}
                    </div>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-600 dark:text-ink-200">{t.text}</p>
                    <div className="mt-6">
                      <p className="font-semibold text-ink-900 dark:text-white">{t.name}</p>
                      <p className="text-xs text-ink-500 dark:text-ink-400">{t.location}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </Container>

      <style>{`
        .swiper-pagination-bullet { background: #7a8291; opacity: 0.5; }
        .swiper-pagination-bullet-active { background: #FF6B00; opacity: 1; }
      `}</style>
    </section>
  )
}
