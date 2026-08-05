import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, PlayCircle, ShieldCheck, Star } from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-ink-950">
      <div className="absolute inset-0">
        <video
          className="h-full w-full object-cover opacity-90"
          autoPlay
          muted
          loop
          playsInline
          poster="/video/roofing-hero-poster.jpg"
        >
          <source src="/video/roofing-hero.mp4" type="video/mp4" />
        </video>
        {/* Light, localized gradient (left side, where the text sits) just
            enough for legibility — the video itself stays clearly visible
            rather than being washed out by a near-opaque overlay. */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/35 to-transparent dark:from-ink-950/85 dark:via-ink-950/40 dark:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent dark:from-ink-950/50" />
      </div>

      {/* Ambient orange glow */}
      <div className="pointer-events-none absolute -top-40 right-0 h-[32rem] w-[32rem] rounded-full bg-ember-500/10 blur-[120px] dark:bg-ember-500/20" />

      <Container className="relative z-10 flex min-h-[92vh] flex-col justify-center py-32 md:py-40">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-ink-200 bg-ink-50/70 px-4 py-2 backdrop-blur-md dark:border-white/15 dark:bg-white/5"
        >
          <div className="flex -space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-ember-500 text-ember-500" />
            ))}
          </div>
          <span className="text-xs font-medium text-ink-600 dark:text-ink-200">4.9 rating from 1,200+ homeowners</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-3xl text-balance font-display text-5xl font-semibold leading-[1.05] text-ink-900 sm:text-6xl lg:text-7xl dark:text-white"
        >
          Roofing, built to
          <span className="relative mx-3 inline-block text-ember-500">
            outlast
            <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none">
              <path d="M2 9C40 2 160 2 198 9" stroke="#FF6B00" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </span>
          the weather.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-ink-600 dark:text-ink-300"
        >
          Premium residential and commercial roofing from a licensed, family-owned crew.
          27 years, 4,200+ roofs, and a workmanship warranty that actually means something.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Button as={Link} to="/contact" size="lg" icon={ArrowRight}>
            Get Your Free Inspection
          </Button>
          <Button
            as="a"
            href="#video"
            variant="outline"
            size="lg"
            icon={PlayCircle}
            iconPosition="left"
            className="border-ink-300 text-ink-800 hover:border-ember-500 hover:text-ember-600 dark:border-white/25 dark:text-white dark:hover:text-ember-400"
          >
            Watch How We Work
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-14 flex items-center gap-3 text-sm text-ink-500 dark:text-ink-400"
        >
          <ShieldCheck className="h-5 w-5 text-ember-500" />
          Licensed &amp; insured · GAF Master Elite Certified · Lifetime workmanship warranty
        </motion.div>
      </Container>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white roofline-up dark:bg-ink-950" />
    </section>
  )
}
