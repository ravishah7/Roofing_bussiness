import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronRight, MapPin, Calendar, Layers, Star, ArrowRight } from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import FloatingRoofShapes from './FloatingRoofShapes'

const headingVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
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

export default function ProjectDetailHero({ project }) {
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 600], [0, 150])

  const words = project.title.split(' ')

  return (
    <section className="relative overflow-hidden bg-ink-950">
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        {project.img && <img src={project.img} alt="" className="h-[130%] w-full object-cover opacity-45" />}
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/75 to-ink-950/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/30 to-transparent" />
      <FloatingRoofShapes />

      <Container className="relative z-10 flex min-h-[78vh] flex-col justify-end pb-16 pt-40 md:min-h-[85vh] md:pb-20">
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center gap-2 text-xs text-ink-400"
        >
          <Link to="/" className="hover:text-ember-400">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/projects" className="hover:text-ember-400">Projects</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-ink-200">{project.title}</span>
        </motion.nav>

        {project.category && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 w-fit rounded-full bg-ember-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-ember-400"
          >
            {project.category}
          </motion.span>
        )}

        <motion.h1
          variants={headingVariants}
          initial="hidden"
          animate="show"
          className="max-w-4xl text-balance font-display text-4xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-7xl"
        >
          {words.map((w, i) => (
            <motion.span key={i} variants={wordVariants} className="mr-4 inline-block">
              {w}
            </motion.span>
          ))}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5 border-t border-white/10 pt-8"
        >
          <Stat icon={MapPin} label="Location" value={project.location} />
          <Stat icon={Calendar} label="Completed" value={project.date} />
          <Stat icon={Layers} label="Services" value={project.servicesUsed?.length ? `${project.servicesUsed.length} performed` : null} />
          <Stat icon={Star} label="Customer Rating" value={project.customerReview?.rating ? `${project.customerReview.rating} / 5` : null} />

          <Button as={Link} to="/contact" icon={ArrowRight} className="ml-auto">
            Get a Quote Like This
          </Button>
        </motion.div>
      </Container>

      <div className="absolute bottom-0 left-0 right-0 h-12 bg-white roofline-up dark:bg-ink-950" />
    </section>
  )
}
