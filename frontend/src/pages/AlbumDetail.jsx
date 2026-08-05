import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, X, Images, ArrowRight } from 'lucide-react'
import Seo from '@/components/Seo'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import FinalCta from '@/components/home/FinalCta'
import FloatingRoofShapes from '@/components/projects/FloatingRoofShapes'
import { useResourceItem } from '@/hooks/useContentQueries'
import { normalizeAlbum, getFallbackAlbums } from '@/lib/normalizeAlbum'
import { PROJECTS } from '@/data/site'
import NotFound from './NotFound'

const headingVariants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const wordVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export default function AlbumDetail() {
  const { slug } = useParams()
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const { data, isLoading, isError } = useResourceItem('gallery', slug)
  const raw = data?.data
  const fallbackRaw = getFallbackAlbums(PROJECTS).find((a) => a.slug === slug)
  const album = raw ? normalizeAlbum(raw) : isError && fallbackRaw ? fallbackRaw : null

  if (isLoading && !album) {
    return (
      <div className="bg-white py-32 dark:bg-ink-950">
        <Container className="max-w-3xl space-y-4">
          <div className="h-8 w-1/2 animate-pulse rounded-lg bg-ink-100 dark:bg-ink-800" />
          <div className="h-64 w-full animate-pulse rounded-2xl bg-ink-100 dark:bg-ink-800" />
        </Container>
      </div>
    )
  }

  if (!album) return <NotFound />

  const images = album.images.map((img) => img.url)
  const words = album.title.split(' ')

  return (
    <>
      <Seo title={album.title} description={album.description || `Photos from ${album.title}`} path={`/gallery/${slug}`} image={album.img} />

      <section className="relative overflow-hidden bg-ink-950">
        {album.img && <img src={album.img} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/75 to-ink-950/40" />
        <FloatingRoofShapes />

        <Container className="relative z-10 flex min-h-[55vh] flex-col justify-end pb-16 pt-40 md:pb-20">
          <motion.nav initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center gap-2 text-xs text-ink-400">
            <Link to="/" className="hover:text-ember-400">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/gallery" className="hover:text-ember-400">Gallery</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-ink-200">{album.title}</span>
          </motion.nav>

          {album.category && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-4 w-fit rounded-full bg-steel-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-steel-400"
            >
              {album.category}
            </motion.span>
          )}

          <motion.h1
            variants={headingVariants}
            initial="hidden"
            animate="show"
            className="max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.05] text-white sm:text-6xl"
          >
            {words.map((w, i) => (
              <motion.span key={i} variants={wordVariants} className="mr-3 inline-block">{w}</motion.span>
            ))}
          </motion.h1>

          {album.description && (
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-6 max-w-xl text-balance text-ink-300">
              {album.description}
            </motion.p>
          )}

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-6 flex items-center gap-2 text-sm text-ink-400">
            <Images className="h-4 w-4 text-ember-500" /> {images.length} photo{images.length === 1 ? '' : 's'}
          </motion.div>
        </Container>

        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white roofline-up dark:bg-ink-950" />
      </section>

      <section className="bg-white py-20 dark:bg-ink-950 md:py-28">
        <Container>
          {images.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <Images className="h-10 w-10 text-ink-300 dark:text-ink-600" />
              <p className="mt-4 text-ink-500 dark:text-ink-400">No photos in this album yet.</p>
            </div>
          ) : (
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
              {album.images.map((img, i) => (
                <motion.button
                  key={img.url + i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  onClick={() => setLightboxIndex(i)}
                  className="group relative block w-full overflow-hidden rounded-2xl"
                >
                  <img src={img.url} alt={img.caption || `${album.title} photo ${i + 1}`} loading="lazy" className="w-full transition-transform duration-500 group-hover:scale-105" />
                  {img.caption && (
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/80 to-transparent p-4 text-left text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {img.caption}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          )}

          <div className="mt-16 flex justify-center">
            <Button as={Link} to="/contact" icon={ArrowRight}>Get a Free Quote</Button>
          </div>
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
            <button onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i - 1 + images.length) % images.length) }} className="absolute left-4 text-white md:left-10" aria-label="Previous"><ChevronLeft className="h-8 w-8" /></button>
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              src={images[lightboxIndex]}
              alt="Album preview"
              className="max-h-[80vh] max-w-full rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i + 1) % images.length) }} className="absolute right-4 text-white md:right-10" aria-label="Next"><ChevronRight className="h-8 w-8" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <FinalCta />
    </>
  )
}
