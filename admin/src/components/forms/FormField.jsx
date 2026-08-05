import { cn } from '@/lib/utils'

export default function FormField({ label, error, hint, required, children, className }) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-danger-500">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-danger-500">{error}</p>}
      {!error && hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  )
}
