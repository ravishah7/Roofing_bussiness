import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight, Wrench } from 'lucide-react'
import Seo from '@/components/Seo'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import FinalCta from '@/components/home/FinalCta'
import ServiceCard from '@/components/services/ServiceCard'
import FloatingRoofShapes from '@/components/projects/FloatingRoofShapes'
import { useResourceList } from '@/hooks/useContentQueries'
import { normalizeService } from '@/lib/normalizeService'
import { SERVICES as FALLBACK_SERVICES } from '@/data/site'

const headingVariants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const wordVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export default function Services() {
  const { data, isLoading, isError } = useResourceList('services', { limit: 100, sort: 'order' })

  const live = data?.data
  const showFallback = isError || (!isLoading && (!live || live.length === 0))
  const services = (live?.length ? live : showFallback ? FALLBACK_SERVICES : []).map(normalizeService)
  const showSkeleton = isLoading && services.length === 0
  const heading = 'Every roofing service, one licensed crew.'

  return (
    <>
      <Seo title="Roofing Services" description="Residential, commercial, repair, replacement, and emergency roofing services." path="/services" />

      <section className="relative overflow-hidden bg-ink-950">
        <FloatingRoofShapes />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-steel-500/10 blur-[140px]" />

        <Container className="relative z-10 flex min-h-[58vh] flex-col justify-end pb-16 pt-40 md:pb-20">
          <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 flex items-center gap-2 text-xs text-ink-400">
            <Link to="/" className="hover:text-ember-400">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-ink-200">Services</span>
          </motion.nav>

          <motion.h1
            variants={headingVariants}
            initial="hidden"
            animate="show"
            className="max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-[4.5rem]"
          >
            {heading.split(' ').map((w, i) => (
              <motion.span key={i} variants={wordVariants} className="mr-3 inline-block">{w}</motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 max-w-lg text-balance text-ink-300"
          >
            From a single shingle repair to a full commercial re-roof, our in-house teams handle it all — no subcontractors, no guesswork.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }} className="mt-10">
            <Button as={Link} to="/contact" icon={ArrowRight}>Request a Free Quote</Button>
          </motion.div>
        </Container>

        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white roofline-up dark:bg-ink-950" />
      </section>

      <section className="bg-white py-20 dark:bg-ink-950 md:py-28">
        <Container>
          {showSkeleton ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(9)].map((_, i) => <div key={i} className="aspect-[4/3] animate-pulse rounded-[2rem] bg-ink-100 dark:bg-ink-800" />)}
            </div>
          ) : services.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <Wrench className="h-10 w-10 text-ink-300 dark:text-ink-600" />
              <p className="mt-4 text-ink-500 dark:text-ink-400">No services published yet — check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
            </div>
          )}
        </Container>
      </section>
      <FinalCta />
    </>
  )
}
