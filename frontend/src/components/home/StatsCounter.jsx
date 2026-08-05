import * as CountUpModule from 'react-countup'
import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import { STATS } from '@/data/site'

// Vite 8's CJS dependency pre-bundling currently double-wraps react-countup's
// default export (a known upstream regression, not specific to this app) —
// `import CountUp from 'react-countup'` can resolve to the whole module
// object instead of the component. Unwrap it defensively so this keeps
// working whichever shape Vite hands back.
const CountUp = CountUpModule.default?.default ?? CountUpModule.default ?? CountUpModule

export default function StatsCounter() {
  return (
    <section className="bg-white py-16 dark:bg-ink-950">
      <Container>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center md:text-left"
            >
              <p className="font-display text-4xl font-semibold text-ink-900 dark:text-white md:text-5xl">
                <CountUp end={stat.value} duration={2.2} decimals={stat.decimals || 0} enableScrollSpy scrollSpyOnce />
                <span className="text-ember-500">{stat.suffix}</span>
              </p>
              <p className="mt-2 text-sm font-medium text-ink-500 dark:text-ink-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
