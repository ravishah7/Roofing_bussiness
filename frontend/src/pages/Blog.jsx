import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Search, Newspaper, ChevronRight, ArrowRight } from 'lucide-react'
import Seo from '@/components/Seo'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import FinalCta from '@/components/home/FinalCta'
import BlogCard from '@/components/blog/BlogCard'
import FloatingRoofShapes from '@/components/projects/FloatingRoofShapes'
import { useResourceList } from '@/hooks/useContentQueries'
import { BLOG_POSTS as FALLBACK_POSTS } from '@/data/site'

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const headingVariants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const wordVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export default function Blog() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const { data, isLoading, isError } = useResourceList('blogs', { limit: 100, sort: '-publishedAt' })

  const live = data?.data
  const showFallback = isError || (!isLoading && (!live || live.length === 0))
  const posts = live?.length ? live : showFallback ? FALLBACK_POSTS : []
  const showSkeleton = isLoading && posts.length === 0

  const categories = useMemo(() => {
    const found = [...new Set(posts.map((p) => (typeof p.category === 'object' ? p.category?.name : p.category)).filter(Boolean))]
    return ['All', ...found]
  }, [posts])

  const filtered = posts.filter((p) => {
    const postCategory = typeof p.category === 'object' ? p.category?.name : p.category
    const matchesCategory = category === 'All' || postCategory === category
    const matchesQuery = p.title.toLowerCase().includes(query.toLowerCase())
    return matchesCategory && matchesQuery
  })

  // First post gets featured (wider) treatment, rest go in the grid
  const featured = filtered[0]
  const rest = filtered.slice(1)
  const heading = 'The Roofing Journal.'

  return (
    <>
      <Seo title="Roofing Blog" description="Tips, guides, and insights on roof maintenance, insurance claims, and materials." path="/blog" />

      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-950">
        <FloatingRoofShapes />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-ember-500/10 blur-[140px]" />

        <Container className="relative z-10 flex min-h-[58vh] flex-col justify-end pb-16 pt-40 md:pb-20">
          <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 flex items-center gap-2 text-xs text-ink-400">
            <Link to="/" className="hover:text-ember-400">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-ink-200">Blog</span>
          </motion.nav>

          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 w-fit rounded-full bg-ember-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-ember-400"
          >
            Resources & Guides
          </motion.span>

          <motion.h1
            variants={headingVariants}
            initial="hidden"
            animate="show"
            className="max-w-3xl font-display text-5xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-[4.5rem]"
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
            Practical guides on roof maintenance, insurance claims, material choices, and what to watch for before the next storm.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-white/10 pt-8 text-sm"
          >
            <div>
              <p className="font-display text-3xl font-semibold text-white">{posts.length || '—'}</p>
              <p className="text-xs uppercase tracking-wider text-ink-400">Articles</p>
            </div>
            <div>
              <p className="font-display text-3xl font-semibold text-white">{Math.max(categories.length - 1, 0)}</p>
              <p className="text-xs uppercase tracking-wider text-ink-400">Topics</p>
            </div>
            <Button as={Link} to="/contact" icon={ArrowRight} className="ml-auto">
              Get Expert Advice
            </Button>
          </motion.div>
        </Container>

        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white roofline-up dark:bg-ink-950" />
      </section>

      {/* Content */}
      <section className="bg-white py-20 dark:bg-ink-950 md:py-28">
        <Container>
          {/* Filters */}
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex flex-wrap gap-3">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    category === c
                      ? 'bg-ember-500 text-white'
                      : 'bg-ink-100 text-ink-600 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-300 dark:hover:bg-ink-700'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-72">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setCategory('All') }}
                placeholder="Search articles..."
                className="w-full rounded-full border border-ink-200 bg-transparent py-3 pl-11 pr-4 text-sm focus:border-ember-500 focus:outline-none dark:border-ink-700 dark:text-white"
              />
            </div>
          </div>

          {showSkeleton ? (
            <div className="mt-12 space-y-8">
              <div className="h-80 animate-pulse rounded-[2rem] bg-ink-50 dark:bg-ink-900/40" />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => <div key={i} className="h-64 animate-pulse rounded-[2rem] bg-ink-50 dark:bg-ink-900/40" />)}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center py-24 text-center">
              <Newspaper className="h-10 w-10 text-ink-300 dark:text-ink-600" />
              <p className="mt-4 text-ink-500 dark:text-ink-400">
                {query ? 'No articles match your search.' : 'No articles published yet — check back soon.'}
              </p>
            </div>
          ) : (
            <div className="mt-12 space-y-6">
              {/* Featured first post */}
              {featured && (
                <BlogCard post={featured} index={0} featured />
              )}

              {/* Rest in 3-column grid */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post, i) => (
                    <BlogCard key={post._id || post.title} post={post} index={i + 1} />
                  ))}
                </div>
              )}
            </div>
          )}
        </Container>
      </section>

      <FinalCta />
    </>
  )
}
