import { cn } from '@/lib/utils'

export default function Container({ children, className }) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-6 md:px-10', className)}>
      {children}
    </div>
  )
}
