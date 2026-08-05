import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Plus, ArrowUpRight } from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import { useResourceList } from '@/hooks/useContentQueries'
import { FAQS as FALLBACK_FAQS } from '@/data/site'

export default function FaqPreview() {
  const [open, setOpen] = useState(0)

  // Public GET /faqs only ever returns isPublished ones for anonymous
  // requests (enforced by the backend) — no extra filter needed here.
  const { data, isLoading, isError } = useResourceList('faqs', { limit: 5, sort: 'order' })

  const live = data?.data
  const showFallback = isError || (!isLoading && (!live || live.length === 0))
  const faqs = live?.length ? live : showFallback ? FALLBACK_FAQS : []
  const showSkeleton = isLoading && faqs.length === 0

  return (
    <section className="bg-ink-50 py-24 dark:bg-ink-900/30 md:py-32">
      <Container className="max-w-4xl">
        <SectionHeading eyebrow="FAQ" title="Answers before you ask." align="center" className="mx-auto" />

        {showSkeleton ? (
          <div className="mt-12 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-white dark:bg-ink-900/40" />
            ))}
          </div>
        ) : (
          <div className="mt-12 divide-y divide-ink-200 dark:divide-ink-800">
            {faqs.map((faq, i) => {
              const question = faq.question ?? faq.q
              const answer = faq.answer ?? faq.a
              return (
                <div key={faq._id || question} className="py-5">
                  <button
                    onClick={() => setOpen(open === i ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 text-left"
                  >
                    <span className="font-display text-lg font-medium text-ink-900 dark:text-white">{question}</span>
                    <Plus className={`h-5 w-5 shrink-0 text-ember-500 transition-transform duration-300 ${open === i ? 'rotate-45' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {open === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="pt-3 text-sm leading-relaxed text-ink-600 dark:text-ink-400">{answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/faq" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ember-600 hover:text-ember-700 dark:text-ember-400">
            View all questions <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  )
}
