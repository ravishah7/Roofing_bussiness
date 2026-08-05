import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Images } from 'lucide-react'

export default function AlbumCard({ album, index = 0 }) {
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
        <Link to={`/gallery/${album.slug}`} className="flex h-full flex-col" aria-label={album.title}>
          <div className="relative aspect-[4/3] overflow-hidden">
            {album.img ? (
              <img
                src={album.img}
                alt={album.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-ink-100 dark:bg-ink-800">
                <Images className="h-10 w-10 text-ink-300 dark:text-ink-600" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/10 to-transparent transition-opacity duration-500 group-hover:from-ink-950/95 group-hover:via-ink-950/25" />

            {album.category && (
              <div
                className="absolute left-0 top-0 flex items-center bg-steel-500 py-2 pl-4 pr-6 text-xs font-semibold text-white"
                style={{ clipPath: 'polygon(0 0, 100% 0, 78% 100%, 0% 100%)' }}
              >
                {album.category}
              </div>
            )}

            <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
              <Images className="h-3 w-3" /> {album.images.length}
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-400 group-hover:opacity-100">
              <span
                className="flex translate-y-3 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition-transform duration-400 group-hover:translate-y-0"
                style={{ transform: 'translateZ(40px)' }}
              >
                View Album <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-6" style={{ transform: 'translateZ(30px)' }}>
              <h3 className="font-display text-xl font-semibold text-white">{album.title}</h3>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  )
}
