import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp, MessageCircle, Phone } from 'lucide-react'
import { useSettings } from '@/hooks/useSettings'

export default function FloatingActions() {
  const [visible, setVisible] = useState(false)
  const { settings } = useSettings()
  const { phone, whatsappNumber } = settings.business
  const cleanPhone = phone.replace(/[^\d+]/g, '')
  const cleanWhatsapp = (whatsappNumber || cleanPhone).replace(/[^\d]/g, '')

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {visible && (
          <motion.button
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-900 text-white shadow-lg dark:bg-white dark:text-ink-900"
          >
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>

      
      <a
        href={`https://wa.me/${cleanWhatsapp}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/30 transition-transform hover:scale-105"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-7 w-7"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12.004 2C6.486 2 2 6.486 2 12.004c0 1.998.586 3.856 1.594 5.42L2 22l4.706-1.55A9.953 9.953 0 0012.004 22C17.522 22 22 17.522 22 12.004 22 6.486 17.522 2 12.004 2zm0 18.087a8.06 8.06 0 01-4.335-1.263l-.311-.185-2.789.92.938-2.72-.202-.28a8.043 8.043 0 01-1.393-4.555c0-4.457 3.628-8.084 8.092-8.084 4.457 0 8.084 3.627 8.084 8.084 0 4.464-3.627 8.083-8.084 8.083z" />
        </svg>
      </a>
      <a
        href={`tel:${cleanPhone}`}
        aria-label="Call now"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-ember-500 text-white shadow-xl shadow-ember-500/30 transition-transform hover:scale-105 lg:hidden"
      >
        <Phone className="h-5 w-5" />
      </a>
    </div>
  )
}
