import { useNavigate } from 'react-router-dom'
import { Menu, Bell, Sun, Moon, LogOut, User, KeyRound, Search } from 'lucide-react'
import { useSidebar } from '@/context/SidebarContext'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { useResourceList } from '@/hooks/useResource'
import Dropdown, { DropdownItem } from '@/components/ui/Dropdown'
import Breadcrumbs from './Breadcrumbs'
import { initials, timeAgo } from '@/lib/utils'

export default function Header() {
  const { setMobileOpen } = useSidebar()
  const { theme, toggleTheme } = useTheme()
  const { admin, logout } = useAuth()
  const navigate = useNavigate()

  const { data } = useResourceList('contact', { limit: 5, sort: '-createdAt', status: 'new' })
  const recentMessages = data?.data || []

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b border-slate-100 bg-white/80 px-4 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/80 sm:px-6">
      <button
        onClick={() => setMobileOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
      >
        <Menu className="h-4.5 w-4.5" />
      </button>

      <div className="hidden flex-1 lg:block">
        <Breadcrumbs />
      </div>

      <div className="relative ml-auto hidden max-w-xs flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          placeholder="Search anything..."
          onFocus={(e) => e.target.blur() /* command palette not wired to a global index yet */}
          className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <Dropdown
          width="w-80"
          trigger={
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
              <Bell className="h-4 w-4" />
              {recentMessages.length > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-danger-500" />
              )}
            </button>
          }
        >
          <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">New contact messages</p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {recentMessages.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-slate-400">You're all caught up</p>
            ) : (
              recentMessages.map((m) => (
                <button
                  key={m._id}
                  onClick={() => navigate('/contact')}
                  className="flex w-full flex-col items-start gap-0.5 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{m.name}</span>
                  <span className="line-clamp-1 text-xs text-slate-500">{m.message || m.service}</span>
                  <span className="text-[11px] text-slate-400">{timeAgo(m.createdAt)}</span>
                </button>
              ))
            )}
          </div>
          <button onClick={() => navigate('/contact')} className="block w-full border-t border-slate-100 px-4 py-2.5 text-center text-xs font-medium text-brand-600 hover:bg-slate-50 dark:border-slate-800 dark:text-brand-400 dark:hover:bg-slate-800">
            View all messages
          </button>
        </Dropdown>

        <Dropdown
          width="w-56"
          trigger={
            <button className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-slate-100 dark:hover:bg-slate-800">
              {admin?.avatar?.url ? (
                <img src={admin.avatar.url} alt="" className="h-7 w-7 rounded-full object-cover" />
              ) : (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white">
                  {initials(admin?.name || 'A')}
                </span>
              )}
            </button>
          }
        >
          <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{admin?.name}</p>
            <p className="text-xs text-slate-400">{admin?.email}</p>
          </div>
          <DropdownItem icon={User} onClick={() => navigate('/profile')}>My Profile</DropdownItem>
          <DropdownItem icon={KeyRound} onClick={() => navigate('/profile/password')}>Change Password</DropdownItem>
          <div className="border-t border-slate-100 dark:border-slate-800" />
          <DropdownItem icon={LogOut} onClick={logout} className="text-danger-500">Log Out</DropdownItem>
        </Dropdown>
      </div>
    </header>
  )
}
