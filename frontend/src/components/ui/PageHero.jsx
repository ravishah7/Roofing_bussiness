import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import Container from './Container'
import FloatingRoofShapes from '@/components/projects/FloatingRoofShapes'

export default function PageHero({ eyebrow, title, description, crumb, floatingShapes = false }) {
  return (
    <section className="relative overflow-hidden bg-ink-950 pb-20 pt-36 md:pb-28 md:pt-44">
      <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-ember-500/15 blur-[120px]" />
      {floatingShapes && <FloatingRoofShapes />}
      <Container className="relative z-10">
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 flex items-center gap-2 text-xs text-ink-400"
          aria-label="Breadcrumb"
        >
          <Link to="/" className="hover:text-ember-400">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-ink-200">{crumb}</span>
        </motion.nav>
        {eyebrow && (
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-ember-500">
            {eyebrow}
          </motion.p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="max-w-2xl text-balance font-display text-4xl font-semibold text-white md:text-5xl"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 max-w-xl text-ink-300"
          >
            {description}
          </motion.p>
        )}
      </Container>
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-white roofline-up dark:bg-ink-950" />
    </section>
  )
}
