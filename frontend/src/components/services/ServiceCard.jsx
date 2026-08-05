import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { getServiceIcon } from '@/lib/serviceIcons'
import { formatPricing } from '@/lib/normalizeService'

export default function ServiceCard({ service, index = 0 }) {
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

  const Icon = typeof service.icon === 'string' ? getServiceIcon(service.icon) : service.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-[2rem] p-[1.5px]"
      style={{ perspective: 1200 }}
    >
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
        <Link to={`/services/${service.slug}`} className="flex h-full flex-col" aria-label={service.title}>
          <div className="relative aspect-[4/3] overflow-hidden">
            {service.img ? (
              <img
                src={service.img}
                alt={service.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-ink-100 dark:bg-ink-800">
                <Icon className="h-12 w-12 text-ink-300 dark:text-ink-600" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/10 to-transparent transition-opacity duration-500 group-hover:from-ink-950/95 group-hover:via-ink-950/25" />

            <div
              className="absolute left-0 top-0 flex h-14 w-14 items-center justify-center bg-ember-500 text-white"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 55%, 55% 100%, 0 100%)' }}
            >
              <Icon className="h-5 w-5" style={{ transform: 'translate(-4px, -4px)' }} />
            </div>

            <div className="absolute right-4 top-4 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
              {formatPricing(service.pricing)}
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-400 group-hover:opacity-100">
              <span
                className="flex translate-y-3 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition-transform duration-400 group-hover:translate-y-0"
                style={{ transform: 'translateZ(40px)' }}
              >
                Learn More <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </div>

          <div className="flex flex-1 flex-col p-6">
            <h3 className="font-display text-xl font-semibold text-ink-900 dark:text-white">{service.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600 dark:text-ink-400">
              {service.shortDescription}
            </p>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  )
}
