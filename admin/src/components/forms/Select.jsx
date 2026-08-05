import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const Select = forwardRef(function Select({ className, error, children, ...props }, ref) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          'h-10 w-full appearance-none rounded-lg border bg-white px-3.5 pr-9 text-sm text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:bg-slate-900 dark:text-white',
          error ? 'border-danger-400' : 'border-slate-200 focus:border-brand-500 dark:border-slate-700',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  )
})
export default Select
