import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight, Images } from 'lucide-react'
import Seo from '@/components/Seo'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import FinalCta from '@/components/home/FinalCta'
import AlbumCard from '@/components/gallery/AlbumCard'
import FloatingRoofShapes from '@/components/projects/FloatingRoofShapes'
import { useResourceList } from '@/hooks/useContentQueries'
import { normalizeAlbum, getFallbackAlbums } from '@/lib/normalizeAlbum'
import { PROJECTS } from '@/data/site'

const FALLBACK_ALBUMS = getFallbackAlbums(PROJECTS)

const headingVariants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const wordVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export default function Gallery() {
  const [filter, setFilter] = useState('All')
  const { data, isLoading, isError } = useResourceList('gallery', { limit: 50 })

  const live = data?.data
  const showFallback = isError || (!isLoading && (!live || live.length === 0))
  const albums = (live?.length ? live : showFallback ? FALLBACK_ALBUMS : []).map(normalizeAlbum)
  const showSkeleton = isLoading && albums.length === 0

  const categories = useMemo(() => ['All', ...new Set(albums.map((a) => a.category).filter(Boolean))], [albums])
  const filtered = filter === 'All' ? albums : albums.filter((a) => a.category === filter)
  const heading = 'A closer look at our craftsmanship.'

  return (
    <>
      <Seo title="Gallery" description="Browse our full photo gallery of completed roofing projects, organized by album." path="/gallery" />

      <section className="relative overflow-hidden bg-ink-950">
        <FloatingRoofShapes />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-ember-500/10 blur-[140px]" />

        <Container className="relative z-10 flex min-h-[58vh] flex-col justify-end pb-16 pt-40 md:pb-20">
          <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 flex items-center gap-2 text-xs text-ink-400">
            <Link to="/" className="hover:text-ember-400">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-ink-200">Gallery</span>
          </motion.nav>

          <motion.h1
            variants={headingVariants}
            initial="hidden"
            animate="show"
            className="max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-[4.5rem]"
          >
            {heading.split(' ').map((w, i) => (
              <motion.span key={i} variants={wordVariants} className="mr-3 inline-block">{w}</motion.span>
            ))}
          </motion.h1>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-10">
            <Button as={Link} to="/contact" icon={ArrowRight}>Start Your Project</Button>
          </motion.div>
        </Container>

        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white roofline-up dark:bg-ink-950" />
      </section>

      <section className="bg-white py-20 dark:bg-ink-950 md:py-28">
        <Container>
          {showSkeleton ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => <div key={i} className="aspect-[4/3] animate-pulse rounded-[2rem] bg-ink-100 dark:bg-ink-800" />)}
            </div>
          ) : albums.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <Images className="h-10 w-10 text-ink-300 dark:text-ink-600" />
              <p className="mt-4 text-ink-500 dark:text-ink-400">No albums published yet — check back soon.</p>
            </div>
          ) : (
            <>
              {categories.length > 2 && (
                <div className="flex flex-wrap gap-3">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setFilter(c)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        filter === c
                          ? 'bg-ember-500 text-white'
                          : 'bg-ink-100 text-ink-600 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-300 dark:hover:bg-ink-700'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((a, i) => <AlbumCard key={a.id} album={a} index={i} />)}
              </div>
            </>
          )}
        </Container>
      </section>
      <FinalCta />
    </>
  )
}
