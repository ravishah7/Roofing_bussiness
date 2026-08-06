import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Phone } from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import { useSettings } from '@/hooks/useSettings'

export default function FinalCta() {
  const { settings } = useSettings()
  const { phone } = settings.business
  const cleanPhone = phone.replace(/[^\d+]/g, '')

  return (
    <section className="relative overflow-hidden bg-ink-950 py-24 md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-ember-500/20 blur-[140px]" />
      <Container className="relative z-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-balance font-display text-4xl font-semibold text-white md:text-5xl"
        >
          Ready for a roof that works as hard as you do?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-4 max-w-lg text-ink-300"
        >
          Book a free, no-obligation inspection and get a written estimate within 24 hours.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button as={Link} to="/contact" size="lg" icon={ArrowRight}>
            Schedule Free Inspection
          </Button>
          <Button as="a" href={`tel:${cleanPhone}`} variant="outline" size="lg" icon={Phone} iconPosition="left" className="border-white/25 text-white hover:border-ember-500 hover:text-ember-400">
            {phone}
          </Button>
        </motion.div>
      </Container>
    </section>
  )
}
