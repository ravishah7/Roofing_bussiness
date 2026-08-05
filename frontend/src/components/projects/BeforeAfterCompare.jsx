import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Maximize2, MoveHorizontal, X } from 'lucide-react'

function SliderPane({ before, after, size = 'default' }) {
  const [pos, setPos] = useState(50)
  const ref = useRef(null)
  const dragging = useRef(false)

  const updatePos = (clientX) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.min(100, Math.max(0, pct)))
  }

  return (
    <div
      ref={ref}
      className={`relative w-full select-none overflow-hidden rounded-3xl bg-ink-100 dark:bg-ink-800 ${
        size === 'fullscreen' ? 'aspect-[16/10] sm:aspect-[16/9]' : 'aspect-[16/10]'
      }`}
      onMouseMove={(e) => dragging.current && updatePos(e.clientX)}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onTouchMove={(e) => updatePos(e.touches[0].clientX)}
    >
      <img src={after} alt="After" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img
          src={before}
          alt="Before"
          className="h-full object-cover"
          style={{ width: ref.current?.clientWidth || '100%' }}
          draggable={false}
        />
      </div>

      <div className="absolute inset-y-0 flex w-1 -translate-x-1/2 items-center bg-white" style={{ left: `${pos}%` }}>
        <button
          onMouseDown={() => (dragging.current = true)}
          onTouchStart={() => (dragging.current = true)}
          onTouchEnd={() => (dragging.current = false)}
          aria-label="Drag to compare before and after"
          className="flex h-11 w-11 -translate-x-1/2 items-center justify-center bg-white text-ink-800 shadow-lg"
          style={{ clipPath: 'polygon(50% 0%, 100% 45%, 100% 100%, 0% 100%, 0% 45%)' }}
        >
          <MoveHorizontal className="h-4 w-4 translate-y-0.5" />
        </button>
      </div>

      <span className="absolute left-4 top-4 rounded-full bg-ink-900/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">Before</span>
      <span className="absolute right-4 top-4 rounded-full bg-ember-500 px-3 py-1 text-xs font-semibold text-white">After</span>
    </div>
  )
}

export default function BeforeAfterCompare({ beforeImages = [], afterImages = [] }) {
  const [pairIndex, setPairIndex] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  const pairCount = Math.min(beforeImages.length, afterImages.length)
  if (pairCount === 0) return null

  const before = beforeImages[pairIndex]?.url
  const after = afterImages[pairIndex]?.url

  return (
    <div>
      <div className="relative">
        <motion.div
          key={pairIndex}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <SliderPane before={before} after={after} />
        </motion.div>

        <button
          onClick={() => setFullscreen(true)}
          className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-ink-900/70 text-white backdrop-blur-sm transition-colors hover:bg-ink-900"
          aria-label="View fullscreen"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      {pairCount > 1 && (
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {Array.from({ length: pairCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPairIndex(i)}
              className={`h-16 w-16 overflow-hidden rounded-xl border-2 transition-colors ${
                i === pairIndex ? 'border-ember-500' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={afterImages[i]?.url} alt={`Comparison ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-950/95 p-4 backdrop-blur-sm sm:p-10"
            onClick={() => setFullscreen(false)}
          >
            <button
              onClick={() => setFullscreen(false)}
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label="Close fullscreen"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <SliderPane before={before} after={after} size="fullscreen" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
