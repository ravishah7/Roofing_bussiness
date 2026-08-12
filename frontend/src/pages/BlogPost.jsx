import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Clock, Calendar, ChevronRight, X, ChevronLeft, ChevronRight as ChevRight, ArrowRight, Tag } from 'lucide-react'
import { FacebookIcon, TwitterIcon, LinkedinIcon } from '@/components/ui/SocialIcons'
import Seo from '@/components/Seo'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import BlogCard from '@/components/blog/BlogCard'
import FinalCta from '@/components/home/FinalCta'
import FloatingRoofShapes from '@/components/projects/FloatingRoofShapes'
import { useResourceItem, useResourceList } from '@/hooks/useContentQueries'
import { BLOG_POSTS as FALLBACK_POSTS } from '@/data/site'
import NotFound from './NotFound'

function slugify(str) {
  return (str || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const headingVariants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const wordVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

// Reading progress bar at the top of the viewport
function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const update = () => {
      const el = document.documentElement
      const total = el.scrollHeight - el.clientHeight
      setProgress(total > 0 ? (el.scrollTop / total) * 100 : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return (
    <div className="fixed left-0 top-0 z-[100] h-1 w-full bg-ink-100 dark:bg-ink-800">
      <motion.div
        className="h-full origin-left bg-ember-500"
        style={{ scaleX: progress / 100 }}
      />
    </div>
  )
}

export default function BlogPost() {
  const { slug } = useParams()
  const heroRef = useRef(null)
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 600], [0, 150])

  const { data, isLoading, isError } = useResourceItem('blogs', slug)
  const { data: listData } = useResourceList('blogs', { limit: 10, sort: '-publishedAt' })

  const live = data?.data
  const fallbackPost = FALLBACK_POSTS.find((p) => slugify(p.title) === slug)
  const post = live ?? (isError && fallbackPost ? fallbackPost : null)

  if (isLoading && !post) {
    return (
      <div className="bg-white dark:bg-ink-950">
        <div className="relative h-[55vh] animate-pulse bg-ink-100 dark:bg-ink-800" />
        <Container className="max-w-3xl py-16 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`h-4 animate-pulse rounded bg-ink-100 dark:bg-ink-800 ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`} />
          ))}
        </Container>
      </div>
    )
  }

  if (!post) return <NotFound />

  const category = typeof post.category === 'object' ? post.category?.name : post.category
  const readMins = post.readingTimeMinutes ?? post.readMins
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : post.date
  const image = post.featuredImage?.url ?? post.image
  const tags = Array.isArray(post.tags) ? post.tags : []
  const authorName = typeof post.author === 'object' ? post.author?.name : 'Summit Roof Co.'
  const authorAvatar = typeof post.author === 'object' ? post.author?.avatar?.url : null
  const pageUrl = typeof window !== 'undefined' ? window.location.href : ''

  const related = (listData?.data ?? FALLBACK_POSTS)
    .filter((p) => (p.slug ?? slugify(p.title)) !== slug)
    .slice(0, 3)

  const words = post.title.split(' ')

  return (
    <>
      <ReadingProgress />
      <Seo
        title={post.seo?.metaTitle || post.title}
        description={post.seo?.metaDescription || post.excerpt}
        path={`/blog/${slug}`}
        image={image}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          image,
          datePublished: post.publishedAt,
          author: { '@type': 'Person', name: authorName },
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-950" ref={heroRef}>
        <motion.div className="absolute inset-0" style={{ y: bgY }}>
          {image && <img src={image} alt="" className="h-[130%] w-full object-cover opacity-40" />}
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/75 to-ink-950/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/60 to-transparent" />
        <FloatingRoofShapes />

        <Container className="relative z-10 flex min-h-[70vh] flex-col justify-end pb-16 pt-40 md:min-h-[80vh] md:pb-20">
          <motion.nav initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center gap-2 text-xs text-ink-400">
            <Link to="/" className="hover:text-ember-400">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/blog" className="hover:text-ember-400">Blog</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="line-clamp-1 text-ink-200">{post.title}</span>
          </motion.nav>

          {category && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-4 w-fit rounded-full bg-ember-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-ember-400"
            >
              {category}
            </motion.span>
          )}

          <motion.h1
            variants={headingVariants}
            initial="hidden"
            animate="show"
            className="max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.05] text-white sm:text-5xl lg:text-6xl"
          >
            {words.map((w, i) => (
              <motion.span key={i} variants={wordVariants} className="mr-3 inline-block">{w}</motion.span>
            ))}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-6 border-t border-white/10 pt-8"
          >
            <div className="flex items-center gap-3">
              {authorAvatar ? (
                <img src={authorAvatar} alt={authorName} className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ember-500 font-display font-bold text-white">
                  {authorName.charAt(0)}
                </span>
              )}
              <div>
                <p className="text-sm font-medium text-white">{authorName}</p>
                {date && <p className="flex items-center gap-1 text-xs text-ink-400"><Calendar className="h-3 w-3" /> {date}</p>}
              </div>
            </div>

            {readMins && (
              <div className="flex items-center gap-1.5 text-sm text-ink-400">
                <Clock className="h-4 w-4 text-ember-500" /> {readMins} min read
              </div>
            )}

            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-ink-500">Share:</span>
              {[
                { Icon: FacebookIcon, href: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}` },
                { Icon: TwitterIcon, href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(post.title)}` },
                { Icon: LinkedinIcon, href: `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}` },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-ember-500 hover:text-ember-400"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </motion.div>
        </Container>

        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white roofline-up dark:bg-ink-950" />
      </section>

      {/* Article body */}
      <article className="bg-white py-16 dark:bg-ink-950 md:py-24">
        <Container className="max-w-3xl">
          {post.excerpt && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-10 text-xl font-medium leading-relaxed text-ink-600 dark:text-ink-300 border-l-4 border-ember-500 pl-6"
            >
              {post.excerpt}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-display prose-headings:font-semibold prose-a:text-ember-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-blockquote:border-ember-500 prose-blockquote:bg-ink-50 prose-blockquote:py-1 prose-blockquote:dark:bg-ink-900/40"
          >
            {post.content ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <p className="text-ink-600 dark:text-ink-400">No content available for this post yet.</p>
            )}
          </motion.div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-ink-100 pt-8 dark:border-ink-800">
              <Tag className="h-4 w-4 text-ink-400" />
              {tags.map((tag) => (
                <span key={tag} className="rounded-full bg-ink-100 px-3 py-1 text-xs font-medium text-ink-600 dark:bg-ink-800 dark:text-ink-300">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Share footer */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-ink-100 pt-8 dark:border-ink-800">
            <div className="flex items-center gap-3">
              {authorAvatar ? (
                <img src={authorAvatar} alt={authorName} className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ember-500 font-display font-bold text-white">
                  {authorName.charAt(0)}
                </span>
              )}
              <div>
                <p className="text-xs text-ink-500 dark:text-ink-400">Written by</p>
                <p className="font-semibold text-ink-900 dark:text-white">{authorName}</p>
              </div>
            </div>
            <Button as={Link} to="/blog" variant="outline" icon={ChevronRight} iconPosition="left">
              More Articles
            </Button>
          </div>
        </Container>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="bg-ink-50 py-20 dark:bg-ink-900/30 md:py-28">
          <Container>
            <div className="mb-12 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ember-600 dark:text-ember-400">Keep Reading</p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-ink-900 dark:text-white">Related articles</h2>
              </div>
              <Link to="/blog" className="hidden items-center gap-1.5 text-sm font-semibold text-ember-600 hover:text-ember-700 dark:text-ember-400 sm:flex">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <BlogCard key={p._id || p.title} post={p} index={i} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <FinalCta />
    </>
  )
}
