import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Siren, Phone } from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'

export default function EmergencyBanner() {
  return (
    <section className="bg-ink-950 py-3">
      <Container>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-ember-500/30 bg-ember-500/10 px-6 py-4 sm:flex-row"
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember-500 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-ember-500" />
            </span>
            <p className="flex items-center gap-2 text-sm font-medium text-white">
              <Siren className="h-4 w-4 text-ember-500" />
              Roof leaking right now? Our emergency crew responds 24/7.
            </p>
          </div>
          <Button as={Link} to="/emergency-roofing" size="sm" icon={Phone} iconPosition="left">
            Emergency Line
          </Button>
        </motion.div>
      </Container>
    </section>
  )
}
