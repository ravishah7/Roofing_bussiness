import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CreditCard, CheckCircle2 } from 'lucide-react'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'

const POINTS = ['0% interest plans available', 'Same-day approval decisions', 'No prepayment penalties']

export default function FinancingBanner() {
  return (
    <section className="bg-white py-16 dark:bg-ink-950">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-steel-600 to-steel-500 px-8 py-14 md:px-16 md:py-16"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white">
                <CreditCard className="h-3.5 w-3.5" /> Flexible Financing
              </span>
              <h3 className="mt-5 text-balance font-display text-3xl font-semibold text-white md:text-4xl">
                A new roof shouldn't wait on your budget.
              </h3>
              <ul className="mt-6 space-y-2">
                {POINTS.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm text-white/90">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-white" /> {p}
                  </li>
                ))}
              </ul>
            </div>
            <Button as={Link} to="/financing" variant="dark" size="lg" className="shrink-0">
              Explore Financing
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
