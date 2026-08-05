import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, HelpCircle } from 'lucide-react'
import Seo from '@/components/Seo'
import PageHero from '@/components/ui/PageHero'
import Container from '@/components/ui/Container'
import FinalCta from '@/components/home/FinalCta'
import { useResourceList } from '@/hooks/useContentQueries'
import { FAQS as FALLBACK_FAQS } from '@/data/site'

export default function Faq() {
  const [open, setOpen] = useState(0)

  const { data, isLoading, isError } = useResourceList('faqs', { limit: 100, sort: 'order' })

  const live = data?.data
  const showFallback = isError || (!isLoading && (!live || live.length === 0))
  const faqs = live?.length ? live : showFallback ? FALLBACK_FAQS : []
  const showSkeleton = isLoading && faqs.length === 0

  return (
    <>
      <Seo title="Frequently Asked Questions" description="Answers to common questions about roofing, insurance, and financing." path="/faq" />
      <PageHero eyebrow="Support" title="Frequently asked questions." crumb="FAQ" />
      <section className="bg-white py-20 dark:bg-ink-950 md:py-28">
        <Container className="max-w-3xl">
          {showSkeleton ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded-xl bg-ink-50 dark:bg-ink-900/40" />
              ))}
            </div>
          ) : faqs.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <HelpCircle className="h-10 w-10 text-ink-300 dark:text-ink-600" />
              <p className="mt-4 text-ink-500 dark:text-ink-400">No questions published yet — check back soon.</p>
            </div>
          ) : (
            <div className="divide-y divide-ink-200 dark:divide-ink-800">
              {faqs.map((faq, i) => {
                const question = faq.question ?? faq.q
                const answer = faq.answer ?? faq.a
                return (
                  <div key={faq._id || question} className="py-5">
                    <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 text-left">
                      <span className="font-display text-lg font-medium text-ink-900 dark:text-white">{question}</span>
                      <Plus className={`h-5 w-5 shrink-0 text-ember-500 transition-transform duration-300 ${open === i ? 'rotate-45' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {open === i && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <p className="pt-3 text-sm leading-relaxed text-ink-600 dark:text-ink-400">{answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          )}
        </Container>
      </section>
      <FinalCta />
    </>
  )
}
