import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function ConsentNotice() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const seen = window.localStorage.getItem('roofco-cookie-consent')
    if (!seen) {
      const t = setTimeout(() => setShow(true), 1200)
      return () => clearTimeout(t)
    }
  }, [])

  const accept = () => {
    window.localStorage.setItem('roofco-cookie-consent', 'true')
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 24 }}
          className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-xl flex-col items-start gap-4 rounded-2xl border border-ink-200 bg-white/95 p-5 shadow-2xl backdrop-blur-lg dark:border-ink-800 dark:bg-ink-900/95 sm:flex-row sm:items-center"
        >
          <Cookie className="h-6 w-6 shrink-0 text-ember-500" />
          <p className="text-sm text-ink-600 dark:text-ink-300">
            We use cookies to improve your browsing experience and analyze site traffic. See our{' '}
            <a href="/privacy-policy" className="font-medium text-ember-600 underline dark:text-ember-400">Privacy Policy</a>.
          </p>
          <Button size="sm" onClick={accept} className="w-full shrink-0 sm:w-auto">
            Accept
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
