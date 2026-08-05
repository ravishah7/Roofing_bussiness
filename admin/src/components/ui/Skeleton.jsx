import { cn } from '@/lib/utils'

export default function Skeleton({ className }) {
  return <div className={cn('skeleton rounded-lg', className)} />
}

export function TableSkeleton({ rows = 6, cols = 5 }) {
  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {[...Array(rows)].map((_, r) => (
        <div key={r} className="flex items-center gap-4 px-6 py-4">
          {[...Array(cols)].map((_, c) => (
            <Skeleton key={c} className={cn('h-4', c === 0 ? 'w-6' : 'flex-1')} />
          ))}
        </div>
      ))}
    </div>
  )
}
