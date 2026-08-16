import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react'
import { useSidebar } from '@/context/SidebarContext'
import { useAuth } from '@/context/AuthContext'
import { NAV_SECTIONS } from '@/lib/nav'
import { cn } from '@/lib/utils'

function SidebarContent({ collapsed, onNavigate }) {
  const { admin } = useAuth()

  return (
    <div className="flex h-full flex-col">
      <div className={cn('flex h-16 shrink-0 items-center border-b border-slate-100 px-5 dark:border-slate-800', collapsed && 'justify-center px-0')}>
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">S</span>
          {!collapsed && <span className="text-sm font-semibold text-slate-900 dark:text-white">Roofing CMS</span>}
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {NAV_SECTIONS.map((section) => {
          const items = section.items.filter((item) => !admin || item.roles.includes(admin.role))
          if (!items.length) return null
          return (
            <div key={section.label}>
              {!collapsed && <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{section.label}</p>}
              <div className="space-y-0.5">
                {items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        collapsed && 'justify-center px-0',
                        isActive
                          ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400'
                          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                      )
                    }
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className="h-[18px] w-[18px] shrink-0" />
                    {!collapsed && item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          )
        })}
      </nav>
    </div>
  )
}

export default function Sidebar() {
  const { collapsed, toggleCollapsed, mobileOpen, setMobileOpen } = useSidebar()

  return (
    <>
      {/* Desktop */}
      <motion.aside
        animate={{ width: collapsed ? 76 : 260 }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        className="relative hidden shrink-0 border-r border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900 lg:block"
      >
        <SidebarContent collapsed={collapsed} />
        <button
          onClick={toggleCollapsed}
          className="absolute -right-3 top-16 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm hover:text-slate-600 dark:border-slate-700 dark:bg-slate-800"
        >
          {collapsed ? <PanelLeftOpen className="h-3 w-3" /> : <PanelLeftClose className="h-3 w-3" />}
        </button>
      </motion.aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setMobileOpen(false)} />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative z-10 h-full w-72 bg-white dark:bg-slate-900"
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent collapsed={false} onNavigate={() => setMobileOpen(false)} />
          </motion.div>
        </div>
      )}
    </>
  )
}
