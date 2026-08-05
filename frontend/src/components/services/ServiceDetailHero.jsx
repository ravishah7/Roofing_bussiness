import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronRight, ArrowRight, Tag, ListChecks } from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import { getServiceIcon } from '@/lib/serviceIcons'
import { formatPricing } from '@/lib/normalizeService'
import FloatingRoofShapes from '@/components/projects/FloatingRoofShapes'

const headingVariants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const wordVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

function Stat({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 shrink-0 text-ember-500" />
      <div>
        <p className="text-[11px] uppercase tracking-wider text-ink-400">{label}</p>
        <p className="text-sm font-medium text-white">{value}</p>
      </div>
    </div>
  )
}

export default function ServiceDetailHero({ service }) {
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 600], [0, 150])
  const Icon = typeof service.icon === 'string' ? getServiceIcon(service.icon) : service.icon
  const words = service.title.split(' ')

  return (
    <section className="relative overflow-hidden bg-ink-950">
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        {service.img && <img src={service.img} alt="" className="h-[130%] w-full object-cover opacity-40" />}
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/75 to-ink-950/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/30 to-transparent" />
      <FloatingRoofShapes />

      <Container className="relative z-10 flex min-h-[70vh] flex-col justify-end pb-16 pt-40 md:min-h-[80vh] md:pb-20">
        <motion.nav initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center gap-2 text-xs text-ink-400">
          <Link to="/" className="hover:text-ember-400">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/services" className="hover:text-ember-400">Services</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-ink-200">{service.title}</span>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-ember-500 text-white shadow-lg shadow-ember-500/30"
        >
          <Icon className="h-7 w-7" />
        </motion.div>

        <motion.h1
          variants={headingVariants}
          initial="hidden"
          animate="show"
          className="max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-7xl"
        >
          {words.map((w, i) => (
            <motion.span key={i} variants={wordVariants} className="mr-4 inline-block">{w}</motion.span>
          ))}
        </motion.h1>

        {service.shortDescription && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 max-w-xl text-balance text-lg text-ink-300"
          >
            {service.shortDescription}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5 border-t border-white/10 pt-8"
        >
          <Stat icon={Tag} label="Investment" value={formatPricing(service.pricing)} />
          <Stat icon={ListChecks} label="What's Included" value={service.features?.length ? `${service.features.length} items` : null} />
          <Button as={Link} to="/contact" icon={ArrowRight} className="ml-auto">Get a Free Quote</Button>
        </motion.div>
      </Container>

      <div className="absolute bottom-0 left-0 right-0 h-12 bg-white roofline-up dark:bg-ink-950" />
    </section>
  )
}
