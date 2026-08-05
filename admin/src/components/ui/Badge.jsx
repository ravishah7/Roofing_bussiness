import { cn } from '@/lib/utils'

const TONES = {
  slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400',
  success: 'bg-success-100 text-success-500 dark:bg-success-500/15',
  warning: 'bg-warning-100 text-warning-500 dark:bg-warning-500/15',
  danger: 'bg-danger-100 text-danger-500 dark:bg-danger-500/15',
  info: 'bg-info-100 text-info-500 dark:bg-info-500/15',
}

export default function Badge({ children, tone = 'slate', className, dot }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium', TONES[tone], className)}>
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', TONES[tone].split(' ')[1] || 'bg-current')} style={{ backgroundColor: 'currentColor' }} />}
      {children}
    </span>
  )
}
