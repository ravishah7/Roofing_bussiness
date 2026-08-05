import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'

const STEPS = [
  { n: '01', title: 'Free Inspection', desc: 'We assess your roof and document every finding with photos and a written report.' },
  { n: '02', title: 'Clear Proposal', desc: 'A transparent, itemized quote — no surprise charges once work begins.' },
  { n: '03', title: 'Expert Install', desc: 'Our licensed crew completes the work on schedule, with daily site cleanup.' },
  { n: '04', title: 'Final Walkthrough', desc: 'We inspect the finished roof together and register your warranty.' },
]

export default function ProcessSteps() {
  return (
    <section className="bg-white py-24 dark:bg-ink-950 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="How It Works"
          title="A straightforward process, from call to completion."
          align="center"
          className="mx-auto"
        />
        <div className="relative mt-16 grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-ink-200 dark:bg-ink-800 md:block" />
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-ink-900 font-display text-sm font-semibold text-white dark:bg-ember-500">
                {step.n}
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-ink-900 dark:text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-400">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
