import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  light = false,
  className,
}) {
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className
      )}
    >
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={cn(
            'mb-3 text-xs font-bold uppercase tracking-[0.2em]',
            light ? 'text-ember-400' : 'text-ember-600'
          )}
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.05 }}
        className={cn(
          'text-balance font-display text-3xl font-semibold leading-[1.1] md:text-4xl lg:text-[2.75rem]',
          light ? 'text-white' : 'text-ink-900 dark:text-white'
        )}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={cn(
            'mt-4 text-base leading-relaxed md:text-lg',
            light ? 'text-ink-200' : 'text-ink-600 dark:text-ink-300'
          )}
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}
