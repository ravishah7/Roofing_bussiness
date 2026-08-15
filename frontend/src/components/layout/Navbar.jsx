import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon, Phone, TriangleAlert } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useSettings } from '@/hooks/useSettings'
import { NAV_LINKS } from '@/data/site'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
 
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const { settings } = useSettings()
  const { name, phone, email } = settings.business
  const cleanPhone = phone.replace(/[^\d+]/g, '')
 
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
 
  useEffect(() => setOpen(false), [location.pathname])
 
  return (
    <>
      <div className="hidden bg-ink-100 py-2 text-ink-600 dark:bg-ink-900 dark:text-ink-200 md:block">
        <Container className="flex items-center justify-between text-xs">
          <p className="flex items-center gap-2">
            <TriangleAlert className="h-3.5 w-3.5 text-ember-500" />
            24/7 Emergency Roofing — storm damage response within the hour
          </p>
          <div className="flex items-center gap-6">
            <a href={`mailto:${email}`} className="hover:text-ink-900 dark:hover:text-white transition-colors">{email}</a>
            <a href={`tel:${cleanPhone}`} className="flex items-center gap-1.5 font-semibold text-ink-900 hover:text-ember-600 dark:text-white dark:hover:text-ember-400 transition-colors">
              <Phone className="h-3.5 w-3.5" /> {phone}
            </a>
          </div>
        </Container>
      </div>
 
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'border-b border-ink-200/60 bg-white/80 backdrop-blur-lg dark:border-ink-800 dark:bg-ink-950/80 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <Container className="flex h-20 items-center justify-between gap-4">
          <Link to="/" className="flex min-w-0 shrink items-center gap-2.5">
            {settings.logo?.url ? (
              <img src={settings.logo.url} alt={name} className="h-10 w-auto shrink-0 object-contain" />
            ) : (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ember-500 font-display text-lg font-bold text-white">
                {name.charAt(0)}
              </span>
            )}
            <span className="truncate font-display text-xl font-semibold tracking-tight text-ink-900 dark:text-white">
              {name}
            </span>
          </Link>
 
          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-ember-600 dark:text-ember-400'
                      : 'text-ink-700 hover:text-ember-600 dark:text-ink-200 dark:hover:text-ember-400'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
 
          <div className="flex shrink-0 items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink-200 text-ink-700 transition-colors hover:border-ember-500 hover:text-ember-600 dark:border-ink-700 dark:text-ink-200 dark:hover:border-ember-400 dark:hover:text-ember-400"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Button as={Link} to="/contact" size="sm" className="hidden  sm:inline-flex">
              Get a Free Quote
            </Button>
            <button
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink-200 text-ink-700 dark:border-ink-700 dark:text-ink-200 lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </Container>
 
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-ink-200 bg-white dark:border-ink-800 dark:bg-ink-950 lg:hidden"
            >
              <Container className="flex flex-col gap-1 py-4">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    className={({ isActive }) =>
                      `rounded-lg px-3 py-3 text-sm font-medium ${
                        isActive
                          ? 'bg-ember-50 text-ember-600 dark:bg-ink-900 dark:text-ember-400'
                          : 'text-ink-700 dark:text-ink-200'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                <Button as={Link} to="/contact" className="mt-2 justify-center">
                  Get a Free Quote
                </Button>
              </Container>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
 