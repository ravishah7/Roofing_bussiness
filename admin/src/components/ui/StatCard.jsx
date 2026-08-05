import { motion } from 'framer-motion'
import * as CountUpModule from 'react-countup'
import { TrendingUp, TrendingDown } from 'lucide-react'
import Card from './Card'
import { cn } from '@/lib/utils'

// Vite 8's CJS dependency pre-bundling can double-wrap react-countup's
// default export (upstream Vite regression, not app-specific) — unwrap
// defensively so this keeps working either way.
const CountUp = CountUpModule.default?.default ?? CountUpModule.default ?? CountUpModule

const ICON_TONES = {
  brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400',
  success: 'bg-success-100 text-success-500 dark:bg-success-500/15',
  warning: 'bg-warning-100 text-warning-500 dark:bg-warning-500/15',
  danger: 'bg-danger-100 text-danger-500 dark:bg-danger-500/15',
  info: 'bg-info-100 text-info-500 dark:bg-info-500/15',
}

export default function StatCard({ label, value, icon: Icon, trend, trendLabel, tone = 'brand', loading, index = 0 }) {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="skeleton h-4 w-24 rounded-full" />
        <div className="skeleton mt-4 h-8 w-16 rounded-lg" />
        <div className="skeleton mt-3 h-3 w-32 rounded-full" />
      </Card>
    )
  }

  const isPositive = trend >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="p-6 transition-shadow hover:shadow-md hover:shadow-slate-200/60 dark:hover:shadow-none">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          {Icon && (
            <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl', ICON_TONES[tone])}>
              <Icon className="h-[18px] w-[18px]" />
            </div>
          )}
        </div>
        <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          <CountUp end={value} duration={1.4} separator="," />
        </p>
        {typeof trend === 'number' && (
          <p className={cn('mt-2 flex items-center gap-1 text-xs font-medium', isPositive ? 'text-success-500' : 'text-danger-500')}>
            {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {Math.abs(trend)}% {trendLabel || 'vs last period'}
          </p>
        )}
      </Card>
    </motion.div>
  )
}
