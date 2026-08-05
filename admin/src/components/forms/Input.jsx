import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const Input = forwardRef(function Input({ className, error, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-10 w-full rounded-lg border bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:bg-slate-900 dark:text-white',
        error ? 'border-danger-400' : 'border-slate-200 focus:border-brand-500 dark:border-slate-700',
        className
      )}
      {...props}
    />
  )
})
export default Input
