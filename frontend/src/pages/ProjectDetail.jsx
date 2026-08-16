import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, MapPin,
  Quote, Star, Wrench, X,
} from 'lucide-react'
import Seo from '@/components/Seo'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import SectionHeading from '@/components/ui/SectionHeading'
import FinalCta from '@/components/home/FinalCta'
import ProjectDetailHero from '@/components/projects/ProjectDetailHero'
import BeforeAfterCompare from '@/components/projects/BeforeAfterCompare'
import ProjectCard from '@/components/projects/ProjectCard'
import { useResourceItem, useResourceList } from '@/hooks/useContentQueries'
import { normalizeProject } from '@/lib/normalizeProject'
import { PROJECTS as FALLBACK_PROJECTS } from '@/data/site'
import NotFound from './NotFound'
import GoogleReviewCard from '@/components/testimonials/GoogleReviewCard'

function slugify(str) {
  return (str || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function GalleryLightbox({ images, index, onClose, onNext, onPrev }) {
  if (index === null) return null
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-950/95 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute right-6 top-6 text-white" aria-label="Close"><X className="h-6 w-6" /></button>
      <button onClick={(e) => { e.stopPropagation(); onPrev() }} className="absolute left-4 text-white md:left-10" aria-label="Previous"><ChevronLeft className="h-8 w-8" /></button>
      <motion.img
        key={index}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        src={images[index]}
        alt="Project gallery preview"
        className="max-h-[80vh] max-w-full rounded-2xl object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      <button onClick={(e) => { e.stopPropagation(); onNext() }} className="absolute right-4 text-white md:right-10" aria-label="Next"><ChevronRight className="h-8 w-8" /></button>
    </motion.div>
  )
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const { data, isLoading, isError } = useResourceItem('projects', slug)
  const { data: listData } = useResourceList('projects', { limit: 100, sort: '-completionDate' })

  const rawProject = data?.data
  const fallbackRaw = FALLBACK_PROJECTS.find((p) => slugify(p.title) === slug)
  const project = rawProject
    ? normalizeProject(rawProject)
    : isError && fallbackRaw
      ? normalizeProject(fallbackRaw)
      : null

  if (isLoading && !project) {
    return (
      <div className="bg-white py-32 dark:bg-ink-950">
        <Container className="max-w-3xl space-y-4">
          <div className="h-8 w-1/2 animate-pulse rounded-lg bg-ink-100 dark:bg-ink-800" />
          <div className="h-64 w-full animate-pulse rounded-2xl bg-ink-100 dark:bg-ink-800" />
        </Container>
      </div>
    )
  }

  if (!project) return <NotFound />

  const galleryUrls = project.gallery.map((g) => g.url)
  const related = (listData?.data ?? [])
    .map(normalizeProject)
    .filter((p) => p.slug !== project.slug && p.category === project.category)
    .slice(0, 3)

  return (
    <>
      <Seo
        title={project.seo?.metaTitle || project.title}
        description={project.seo?.metaDescription || project.description?.slice(0, 155)}
        path={`/projects/${slug}`}
        image={project.img}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: project.title,
          description: project.description,
          image: project.img,
          locationCreated: project.location ? { '@type': 'Place', name: project.location } : undefined,
        }}
      />

      <ProjectDetailHero project={project} />

      {/* Overview */}
      <section className="bg-white py-24 dark:bg-ink-950 md:py-28">
        <Container className="grid grid-cols-1 gap-16 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionHeading eyebrow="The Project" title="Project overview" />
            <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-ink-600 dark:text-ink-400">
              {project.description}
            </p>
          </div>

          {(project.servicesUsed.length > 0 || project.locationDetail?.address) && (
            <aside className="space-y-6">
              {project.servicesUsed.length > 0 && (
                <div className="rounded-3xl border border-ink-100 p-6 dark:border-ink-800">
                  <h3 className="flex items-center gap-2 font-display text-base font-semibold text-ink-900 dark:text-white">
                    <Wrench className="h-4 w-4 text-ember-500" /> Services Performed
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {project.servicesUsed.map((s) => (
                      <li key={s._id || s.title}>
                        <Link
                          to={`/services/${s.slug}`}
                          className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-ink-600 transition-colors hover:bg-ink-50 hover:text-ember-600 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-ember-400"
                        >
                          {s.title} <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(project.locationDetail?.address || project.location) && (
                <div className="rounded-3xl border border-ink-100 p-6 dark:border-ink-800">
                  <h3 className="flex items-center gap-2 font-display text-base font-semibold text-ink-900 dark:text-white">
                    <MapPin className="h-4 w-4 text-ember-500" /> Location
                  </h3>
                  <p className="mt-3 text-sm text-ink-600 dark:text-ink-400">
                    {project.locationDetail?.address && <>{project.locationDetail.address}<br /></>}
                    {project.location}
                  </p>
                  {project.locationDetail?.lat && project.locationDetail?.lng && (
                    <div className="mt-4 overflow-hidden rounded-2xl">
                      <iframe
                        title="Project location map"
                        src={`https://www.google.com/maps?q=${project.locationDetail.lat},${project.locationDetail.lng}&z=14&output=embed`}
                        className="h-40 w-full border-0"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              )}
            </aside>
          )}
        </Container>
      </section>

      {/* Before / After */}
      {(project.beforeImages.length > 0 && project.afterImages.length > 0) && (
        <section className="bg-ink-50 py-24 dark:bg-ink-900/30 md:py-28">
          <Container>
            <SectionHeading eyebrow="Transformation" title="Before &amp; after." align="center" className="mx-auto" />
            <div className="mx-auto mt-12 max-w-4xl">
              <BeforeAfterCompare beforeImages={project.beforeImages} afterImages={project.afterImages} />
            </div>
          </Container>
        </section>
      )}

      {/* Gallery */}
      {galleryUrls.length > 0 && (
        <section className="bg-white py-24 dark:bg-ink-950 md:py-28">
          <Container>
            <SectionHeading eyebrow="Gallery" title="Every angle." />
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {galleryUrls.map((url, i) => (
                <motion.button
                  key={url + i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  onClick={() => setLightboxIndex(i)}
                  className="block aspect-square w-full overflow-hidden rounded-2xl"
                >
                  <img
                    src={url}
                    alt={`${project.title} photo ${i + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </motion.button>
              ))}
            </div>
          </Container>
        </section>
      )}

      <AnimatePresence>
        {lightboxIndex !== null && (
          <GalleryLightbox
            images={galleryUrls}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNext={() => setLightboxIndex((i) => (i + 1) % galleryUrls.length)}
            onPrev={() => setLightboxIndex((i) => (i - 1 + galleryUrls.length) % galleryUrls.length)}
          />
        )}
      </AnimatePresence>

      {/* Customer review */}
      {project.customerReview?.text && (
        <section className="bg-ink-950 py-24 md:py-28">
          <Container className="max-w-xl">
            <GoogleReviewCard
              testimonial={{
                name: project.customerReview.name || 'Verified Customer',
                location: project.location,
                rating: project.customerReview.rating,
                text: project.customerReview.text,
              }}
            />
          </Container>
        </section>
      )}
      {/* Related projects */}
      {related.length > 0 && (
        <section className="bg-white py-24 dark:bg-ink-950 md:py-28">
          <Container>
            <div className="flex items-end justify-between">
              <SectionHeading eyebrow="More Work" title="Related projects" />
              <Link to="/projects" className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-ember-600 hover:text-ember-700 dark:text-ember-400 sm:flex">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
            </div>
          </Container>
        </section>
      )}

      <FinalCta />
    </>
  )
}
