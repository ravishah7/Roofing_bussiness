import { Link } from 'react-router-dom'
import { CompassIcon, Home } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <CompassIcon className="h-12 w-12 text-slate-300" />
      <h1 className="mt-6 text-4xl font-bold text-slate-900 dark:text-white">404</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">This page doesn't exist in the dashboard.</p>
      <Link to="/"><Button icon={Home} className="mt-6">Back to Dashboard</Button></Link>
    </div>
  )
}
