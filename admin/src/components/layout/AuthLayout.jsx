import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, TrendingUp, Users } from 'lucide-react'

const FEATURES = [
  { icon: ShieldCheck, text: 'Role-based access with JWT refresh sessions' },
  { icon: TrendingUp, text: 'Live stats on leads, content, and traffic' },
  { icon: Users, text: 'One workspace for your whole content team' },
]

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-slate-900 p-12 text-white lg:flex">
        <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-brand-500/20 blur-[120px]" />
        <div className="relative z-10 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">S</span>
          <span className="font-semibold">Summit Roof Co. — CMS</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <h1 className="max-w-md text-3xl font-semibold leading-tight">
            Manage your entire website from one premium dashboard.
          </h1>
          <div className="mt-10 space-y-4">
            {FEATURES.map((f) => (
              <div key={f.text} className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <f.icon className="h-4 w-4 text-brand-400" />
                </span>
                {f.text}
              </div>
            ))}
          </div>
        </motion.div>

        <p className="relative z-10 text-xs text-slate-500">© {new Date().getFullYear()} Summit Roof Co.</p>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
