import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, MapPin, Star } from 'lucide-react'

export default function ProjectCard({ project, index = 0 }) {
  const ref = useRef(null)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const springConfig = { stiffness: 150, damping: 18, mass: 0.5 }
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [7, -7]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-7, 7]), springConfig)

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }
  const handleMouseLeave = () => {
    mouseX.set(0.5)
    mouseY.set(0.5)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-[2rem] p-[1.5px]"
      style={{ perspective: 1200 }}
    >
      {/* Animated gradient ring — only visible on hover, rotates continuously underneath */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
        <motion.div
          className="absolute -inset-1/2 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0%, #FF6B00 12%, transparent 28%, transparent 72%, #1E5AA8 88%, transparent 100%)',
          }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
        />
      </div>

      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative flex h-full flex-col overflow-hidden rounded-[calc(2rem-1.5px)] bg-white shadow-sm shadow-ink-900/5 dark:bg-ink-900"
      >
        <Link to={`/projects/${project.slug}`} className="flex h-full flex-col" aria-label={project.title}>
          <div className="relative aspect-[4/5] overflow-hidden">
            {project.img ? (
              <img
                src={project.img}
                alt={project.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
            ) : (
              <div className="h-full w-full bg-ink-100 dark:bg-ink-800" />
            )}

            {/* Dark overlay, intensifies on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/25 to-transparent transition-opacity duration-500 group-hover:from-ink-950/98 group-hover:via-ink-950/40" />

            {/* Roofline-notch category badge */}
            {project.category && (
              <div
                className="absolute left-0 top-0 flex items-center bg-ember-500 py-2 pl-4 pr-6 text-xs font-semibold text-white"
                style={{ clipPath: 'polygon(0 0, 100% 0, 78% 100%, 0% 100%)' }}
              >
                {project.category}
              </div>
            )}

            {project.isFeatured && (
              <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                <Star className="h-3 w-3 fill-ember-400 text-ember-400" /> Featured
              </div>
            )}

            {/* Floating "View Project" button — glassmorphism */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-400 group-hover:opacity-100">
              <span
                className="flex translate-y-3 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition-transform duration-400 group-hover:translate-y-0"
                style={{ transform: 'translateZ(40px)' }}
              >
                View Project <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>

            {/* Bottom info panel — glass, always visible */}
            <div className="absolute inset-x-0 bottom-0 p-6" style={{ transform: 'translateZ(30px)' }}>
              <h3 className="font-display text-xl font-semibold text-white">{project.title}</h3>
              {project.location && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-200">
                  <MapPin className="h-3.5 w-3.5 shrink-0" /> {project.location}
                </p>
              )}
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  )
}
