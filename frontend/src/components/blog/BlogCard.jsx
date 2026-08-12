import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Clock, ArrowUpRight } from 'lucide-react'

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function BlogCard({ post, index = 0, featured = false }) {
  const ref = useRef(null)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const springConfig = { stiffness: 150, damping: 18, mass: 0.5 }
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [5, -5]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-5, 5]), springConfig)

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }
  const handleMouseLeave = () => { mouseX.set(0.5); mouseY.set(0.5) }

  const category = typeof post.category === 'object' ? post.category?.name : post.category
  const slug = post.slug ?? slugify(post.title)
  const readMins = post.readingTimeMinutes ?? post.readMins
  const image = post.featuredImage?.url ?? post.image
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : post.date

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-[2rem] p-[1.5px]"
      style={{ perspective: 1200 }}
    >
      {/* Animated gradient border on hover */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
        <motion.div
          className="absolute -inset-1/2 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0%, #FF6B00 12%, transparent 28%, transparent 72%, #1E5AA8 88%, transparent 100%)',
          }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
        />
      </div>

      <motion.article
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={`relative flex h-full flex-col overflow-hidden rounded-[calc(2rem-1.5px)] bg-white shadow-sm shadow-ink-900/5 dark:bg-ink-900 ${featured ? 'md:flex-row' : ''}`}
      >
        <Link to={`/blog/${slug}`} className={`flex h-full flex-col ${featured ? 'md:flex-row' : ''}`} aria-label={post.title}>
          {/* Image section */}
          <div className={`relative overflow-hidden bg-ink-100 dark:bg-ink-800 ${featured ? 'aspect-video md:aspect-auto md:w-1/2' : 'aspect-[16/9]'}`}>
            {image ? (
              <img
                src={image}
                alt={post.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="font-display text-6xl font-bold text-ink-200 dark:text-ink-700">
                  {post.title.charAt(0)}
                </span>
              </div>
            )}

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Category badge — roofline-notch style */}
            {category && (
              <div
                className="absolute left-0 top-0 flex items-center bg-ember-500 py-2 pl-4 pr-6 text-xs font-semibold text-white"
                style={{ clipPath: 'polygon(0 0, 100% 0, 78% 100%, 0% 100%)' }}
              >
                {category}
              </div>
            )}

            {/* Floating read button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-400 group-hover:opacity-100">
              <span
                className="flex translate-y-3 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition-transform duration-400 group-hover:translate-y-0"
                style={{ transform: 'translateZ(30px)' }}
              >
                Read Article <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </div>

          {/* Content section */}
          <div className="flex flex-1 flex-col p-6">
            <div className="flex items-center gap-3 text-xs text-ink-500 dark:text-ink-400">
              {date && <span>{date}</span>}
              {date && readMins && <span className="text-ink-300 dark:text-ink-700">·</span>}
              {readMins && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {readMins} min read
                </span>
              )}
            </div>

            <h3 className={`mt-3 font-display font-semibold text-ink-900 dark:text-white ${featured ? 'text-2xl' : 'text-xl'}`}>
              {post.title}
            </h3>

            {post.excerpt && (
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600 dark:text-ink-400 line-clamp-3">
                {post.excerpt}
              </p>
            )}

            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ember-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:text-ember-400">
              Read more <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </Link>
      </motion.article>
    </motion.div>
  )
}
