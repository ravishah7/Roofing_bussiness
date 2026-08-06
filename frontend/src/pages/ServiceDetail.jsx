import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ChevronLeft, ChevronRight, X, ArrowRight } from 'lucide-react'
import Seo from '@/components/Seo'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import SectionHeading from '@/components/ui/SectionHeading'
import FinalCta from '@/components/home/FinalCta'
import ServiceDetailHero from '@/components/services/ServiceDetailHero'
import ServiceCard from '@/components/services/ServiceCard'
import { useResourceItem, useResourceList } from '@/hooks/useContentQueries'
import { useSettings } from '@/hooks/useSettings'
import { normalizeService, formatPricing } from '@/lib/normalizeService'
import { SERVICES as FALLBACK_SERVICES } from '@/data/site'
import NotFound from './NotFound'

export default function ServiceDetail() {
  const { slug } = useParams()
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const { data, isLoading, isError } = useResourceItem('services', slug)
  const { data: listData } = useResourceList('services', { limit: 100, sort: 'order' })

  const { settings } = useSettings()
  const { name: businessName } = settings.business
  const fallbackRaw = FALLBACK_SERVICES.find((s) => s.slug === slug)
  const service = rawService
    ? normalizeService(rawService)
    : isError && fallbackRaw
      ? normalizeService(fallbackRaw)
      : null

  if (isLoading && !service) {
    return (
      <div className="bg-white py-32 dark:bg-ink-950">
        <Container className="max-w-3xl space-y-4">
          <div className="h-8 w-1/2 animate-pulse rounded-lg bg-ink-100 dark:bg-ink-800" />
          <div className="h-64 w-full animate-pulse rounded-2xl bg-ink-100 dark:bg-ink-800" />
        </Container>
      </div>
    )
  }

  if (!service) return <NotFound />

  const galleryUrls = service.gallery.map((g) => g.url)
  const related = (listData?.data ?? [])
    .map(normalizeService)
    .filter((s) => s.slug !== service.slug)
    .slice(0, 3)

  return (
    <>
      <Seo
        title={service.seo?.metaTitle || service.title}
        description={service.seo?.metaDescription || service.shortDescription || service.description?.slice(0, 155)}
        path={`/services/${slug}`}
        image={service.img}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          serviceType: service.title,
          description: service.description,
          provider: { '@type': 'RoofingContractor', name: businessName },
        }}
      />

      <ServiceDetailHero service={service} />

      <section className="bg-white py-24 dark:bg-ink-950 md:py-28">
        <Container className="grid grid-cols-1 gap-16 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionHeading eyebrow="Overview" title="What this service covers" />
            <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-ink-600 dark:text-ink-400">
              {service.description}
            </p>

            {service.features.length > 0 && (
              <div className="mt-10">
                <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-white">What's included</h3>
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {service.features.map((f, i) => (
                    <motion.div
                      key={f}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-2.5 rounded-xl bg-ink-50 px-4 py-3 text-sm text-ink-700 dark:bg-ink-900/40 dark:text-ink-300"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ember-500" /> {f}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {galleryUrls.length > 0 && (
              <div className="mt-14">
                <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-white">Gallery</h3>
                <div className="mt-5 columns-1 gap-4 sm:columns-2 [&>*]:mb-4">
                  {galleryUrls.map((url, i) => (
                    <button key={url + i} onClick={() => setLightboxIndex(i)} className="block w-full overflow-hidden rounded-2xl">
                      <img src={url} alt={`${service.title} example ${i + 1}`} loading="lazy" className="w-full transition-transform duration-500 hover:scale-105" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="h-fit space-y-6">
            <div className="rounded-3xl border-2 border-ember-500/20 bg-ember-50/50 p-8 dark:border-ember-500/20 dark:bg-ember-500/5">
              <p className="text-xs font-semibold uppercase tracking-wider text-ember-600 dark:text-ember-400">Investment</p>
              <p className="mt-2 font-display text-3xl font-semibold text-ink-900 dark:text-white">{formatPricing(service.pricing)}</p>
              {service.pricing?.note && <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">{service.pricing.note}</p>}
              <Button as={Link} to="/contact" icon={ArrowRight} className="mt-6 w-full justify-center">Get a Free Quote</Button>
            </div>
          </aside>
        </Container>
      </section>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-950/95 p-6 backdrop-blur-sm"
            onClick={() => setLightboxIndex(null)}
          >
            <button onClick={() => setLightboxIndex(null)} className="absolute right-6 top-6 text-white" aria-label="Close"><X className="h-6 w-6" /></button>
            <button onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i - 1 + galleryUrls.length) % galleryUrls.length) }} className="absolute left-4 text-white md:left-10" aria-label="Previous"><ChevronLeft className="h-8 w-8" /></button>
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              src={galleryUrls[lightboxIndex]}
              alt="Service example"
              className="max-h-[80vh] max-w-full rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i + 1) % galleryUrls.length) }} className="absolute right-4 text-white md:right-10" aria-label="Next"><ChevronRight className="h-8 w-8" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {related.length > 0 && (
        <section className="bg-ink-50 py-24 dark:bg-ink-900/30 md:py-28">
          <Container>
            <SectionHeading eyebrow="More Ways We Help" title="Other services" align="center" className="mx-auto" />
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
            </div>
          </Container>
        </section>
      )}

      <FinalCta />
    </>
  )
}
