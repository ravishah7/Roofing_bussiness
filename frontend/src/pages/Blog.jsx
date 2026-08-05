import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Search, Clock, ArrowUpRight, Newspaper } from 'lucide-react'
import Seo from '@/components/Seo'
import PageHero from '@/components/ui/PageHero'
import Container from '@/components/ui/Container'
import { useResourceList } from '@/hooks/useContentQueries'
import { BLOG_POSTS as FALLBACK_POSTS } from '@/data/site'

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
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

  return (
    <>
      <Seo title="Roofing Blog" description="Tips, guides, and insights on roof maintenance, insurance claims, and materials." path="/blog" />
      <PageHero eyebrow="Resources" title="The Roofing Journal" crumb="Blog" description="Practical guides on maintenance, insurance claims, and choosing the right materials." floatingShapes />

      <section className="bg-white py-24 dark:bg-ink-950 md:py-32">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex flex-wrap gap-3">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    category === c ? 'bg-ember-500 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-300'
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
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full rounded-full border border-ink-200 bg-transparent py-3 pl-11 pr-4 text-sm focus:border-ember-500 focus:outline-none dark:border-ink-700"
              />
            </div>
          </div>

          {showSkeleton ? (
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
              {[...Array(4)].map((_, i) => <div key={i} className="h-80 animate-pulse rounded-3xl bg-ink-50 dark:bg-ink-900/40" />)}
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <Newspaper className="h-10 w-10 text-ink-300 dark:text-ink-600" />
              <p className="mt-4 text-ink-500 dark:text-ink-400">No articles published yet — check back soon.</p>
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
              {filtered.map((post, i) => {
                const postCategory = typeof post.category === 'object' ? post.category?.name : post.category
                const slug = post.slug ?? slugify(post.title)
                const readMins = post.readingTimeMinutes ?? post.readMins
                const image = post.featuredImage?.url
                return (
                  <motion.article
                    key={post._id || post.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (i % 2) * 0.08 }}
                    className="group overflow-hidden rounded-3xl border border-ink-100 dark:border-ink-800"
                  >
                    <Link to={`/blog/${slug}`} className="block">
                      <div className="aspect-video overflow-hidden bg-ink-100 dark:bg-ink-800">
                        {image && (
                          <img
                            src={image}
                            alt={post.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 text-xs font-medium text-ember-600 dark:text-ember-400">
                          {postCategory && <span>{postCategory}</span>}
                          {postCategory && <span className="text-ink-300 dark:text-ink-600">•</span>}
                          <span className="flex items-center gap-1 text-ink-500 dark:text-ink-400"><Clock className="h-3 w-3" /> {readMins} min read</span>
                        </div>
                        <h3 className="mt-3 font-display text-xl font-semibold text-ink-900 dark:text-white">{post.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-400">{post.excerpt}</p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900 dark:text-white">
                          Read article <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </Link>
                  </motion.article>
                )
              })}
              {filtered.length === 0 && (
                <p className="col-span-2 py-12 text-center text-ink-500">No articles match your search.</p>
              )}
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
