import { cn } from '@/lib/utils'

export default function Card({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }) {
  return <div className={cn('flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800', className)}>{children}</div>
}
export function CardTitle({ children, className }) {
  return <h3 className={cn('font-semibold text-slate-900 dark:text-white', className)}>{children}</h3>
}
export function CardContent({ children, className }) {
  return <div className={cn('p-6', className)}>{children}</div>
}
