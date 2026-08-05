import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight, FolderKanban } from 'lucide-react'
import Seo from '@/components/Seo'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import FinalCta from '@/components/home/FinalCta'
import ProjectCard from '@/components/projects/ProjectCard'
import FloatingRoofShapes from '@/components/projects/FloatingRoofShapes'
import { useResourceList } from '@/hooks/useContentQueries'
import { normalizeProject } from '@/lib/normalizeProject'
import { PROJECTS as FALLBACK_PROJECTS } from '@/data/site'

const headingVariants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const wordVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export default function Projects() {
  const [filter, setFilter] = useState('All')

  const { data, isLoading, isError } = useResourceList('projects', { limit: 100, sort: '-completionDate' })

  const live = data?.data
  const showFallback = isError || (!isLoading && (!live || live.length === 0))
  const rawProjects = live?.length ? live : showFallback ? FALLBACK_PROJECTS : []
  const projects = rawProjects.map(normalizeProject)
  const showSkeleton = isLoading && projects.length === 0

  const categories = useMemo(() => ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))], [projects])
  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter)
  const heading = 'Roofs we\u2019re proud to stand behind.'

  return (
    <>
      <Seo
        title="Projects"
        description="Browse completed residential and commercial roofing projects — real transformations, real customers."
        path="/projects"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-950">
        <FloatingRoofShapes />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-ember-500/10 blur-[140px]" />

        <Container className="relative z-10 flex min-h-[62vh] flex-col justify-end pb-16 pt-40 md:pb-20">
          <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 flex items-center gap-2 text-xs text-ink-400">
            <Link to="/" className="hover:text-ember-400">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-ink-200">Projects</span>
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

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 max-w-lg text-balance text-ink-300"
          >
            Every project below is a real installation, restoration, or repair completed by our own licensed crews — not stock photography.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-white/10 pt-8 text-sm"
          >
            <div>
              <p className="font-display text-3xl font-semibold text-white">{projects.length || '—'}</p>
              <p className="text-xs uppercase tracking-wider text-ink-400">Projects shown</p>
            </div>
            <div>
              <p className="font-display text-3xl font-semibold text-white">{Math.max(categories.length - 1, 0)}</p>
              <p className="text-xs uppercase tracking-wider text-ink-400">Categories</p>
            </div>
            <Button as={Link} to="/contact" icon={ArrowRight} className="ml-auto">Start Your Project</Button>
          </motion.div>
        </Container>

        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white roofline-up dark:bg-ink-950" />
      </section>

      {/* Grid */}
      <section className="bg-white py-20 dark:bg-ink-950 md:py-28">
        <Container>
          {showSkeleton ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => <div key={i} className="aspect-[4/5] animate-pulse rounded-[2rem] bg-ink-100 dark:bg-ink-800" />)}
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <FolderKanban className="h-10 w-10 text-ink-300 dark:text-ink-600" />
              <p className="mt-4 text-ink-500 dark:text-ink-400">No projects published yet — check back soon.</p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-3">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setFilter(c)}
                    className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      filter === c
                        ? 'bg-ember-500 text-white'
                        : 'bg-ink-100 text-ink-600 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-300 dark:hover:bg-ink-700'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
              </div>

              {filtered.length === 0 && (
                <p className="py-16 text-center text-ink-500 dark:text-ink-400">No projects in this category yet.</p>
              )}
            </>
          )}
        </Container>
      </section>

      <FinalCta />
    </>
  )
}
