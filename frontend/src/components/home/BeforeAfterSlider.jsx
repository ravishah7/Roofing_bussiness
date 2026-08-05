import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { MoveHorizontal } from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'

const BEFORE = 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop'
const AFTER = '/images/roof-install-after.jpg'

export default function BeforeAfterSlider() {
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
    <section className="bg-ink-50 py-24 dark:bg-ink-900/30 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Real Results"
          title="See the transformation for yourself."
          description="Drag the slider to compare a real before-and-after from a recent residential re-roof."
          align="center"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative mx-auto mt-14 aspect-[16/9] max-w-4xl select-none overflow-hidden rounded-3xl shadow-2xl"
          ref={ref}
          onMouseMove={(e) => dragging.current && updatePos(e.clientX)}
          onMouseUp={() => (dragging.current = false)}
          onMouseLeave={() => (dragging.current = false)}
          onTouchMove={(e) => updatePos(e.touches[0].clientX)}
        >
          <img src={AFTER} alt="After roof replacement" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
          <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
            <img src={BEFORE} alt="Before roof replacement" className="h-full w-full object-cover" style={{ width: ref.current?.clientWidth }} draggable={false} />
          </div>

          <div className="absolute inset-y-0 flex w-1 -translate-x-1/2 items-center bg-white" style={{ left: `${pos}%` }}>
            <button
              onMouseDown={() => (dragging.current = true)}
              className="flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-white text-ink-800 shadow-lg"
              aria-label="Drag to compare"
            >
              <MoveHorizontal className="h-4 w-4" />
            </button>
          </div>

          <span className="absolute left-4 top-4 rounded-full bg-ink-900/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">Before</span>
          <span className="absolute right-4 top-4 rounded-full bg-ember-500 px-3 py-1 text-xs font-semibold text-white">After</span>
        </motion.div>
      </Container>
    </section>
  )
}
