import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const VARIANTS = {
  primary: 'bg-ember-500 text-white shadow-lg shadow-ember-500/25 hover:bg-ember-600 hover:shadow-xl hover:shadow-ember-500/30',
  dark: 'bg-ink-800 text-white hover:bg-ink-700 dark:bg-white dark:text-ink-900 dark:hover:bg-ink-100',
  outline: 'border border-ink-300 text-ink-800 hover:border-ember-500 hover:text-ember-600 dark:border-ink-600 dark:text-ink-100 dark:hover:border-ember-400 dark:hover:text-ember-400',
  ghost: 'text-ink-800 hover:bg-ink-100 dark:text-ink-100 dark:hover:bg-ink-800',
}

const SIZES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3.5 text-sm',
  lg: 'px-8 py-4 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  as: Comp = 'button',
  className,
  icon: Icon,
  iconPosition = 'right',
  ...props
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="inline-block"
    >
      <Comp
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-500',
          VARIANTS[variant],
          SIZES[size],
          className
        )}
        {...props}
      >
        {Icon && iconPosition === 'left' && <Icon className="h-4 w-4" />}
        {children}
        {Icon && iconPosition === 'right' && <Icon className="h-4 w-4" />}
      </Comp>
    </motion.div>
  )
}
