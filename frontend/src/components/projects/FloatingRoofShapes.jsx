import { motion } from 'framer-motion'

// Soft, blurred roof-gable silhouettes drifting slowly in the background —
// an ambient callback to a roofline rather than a generic decorative blob.
// Each shape wanders through several waypoints (not a simple back-and-forth
// bounce) so the movement reads as loose and organic rather than a
// mechanical loop, and the ranges are large enough to actually notice.
const SHAPES = [
  {
    size: 380, top: '-8%', left: '68%', tone: 'ember', duration: 24, delay: 0,
    x: [0, 50, -30, 20, 0], y: [0, -70, -20, -90, 0], rotate: [0, 14, -8, 10, 0],
  },
  {
    size: 260, top: '55%', left: '-6%', tone: 'steel', duration: 29, delay: 1.5,
    x: [0, -45, 25, -20, 0], y: [0, 60, -30, 40, 0], rotate: [0, -12, 9, -14, 0],
  },
  {
    size: 200, top: '12%', left: '8%', tone: 'ember', duration: 21, delay: 3,
    x: [0, 35, -50, 15, 0], y: [0, -45, 30, -60, 0], rotate: [0, 10, -16, 8, 0],
  },
  {
    size: 150, top: '68%', left: '78%', tone: 'steel', duration: 26, delay: 4.5,
    x: [0, -30, 20, -45, 0], y: [0, 35, -55, 20, 0], rotate: [0, -9, 13, -7, 0],
  },
]

const TONE_CLASSES = {
  ember: 'bg-ember-500/15 dark:bg-ember-500/20',
  steel: 'bg-steel-500/15 dark:bg-steel-500/20',
}

export default function FloatingRoofShapes({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {SHAPES.map((s, i) => (
        <motion.div
          key={i}
          className={`absolute blur-2xl ${TONE_CLASSES[s.tone]}`}
          style={{
            width: s.size,
            height: s.size * 0.86,
            top: s.top,
            left: s.left,
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
          }}
          animate={{ x: s.x, y: s.y, rotate: s.rotate }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
