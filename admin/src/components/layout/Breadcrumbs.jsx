import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const LABELS = {
  blog: 'Blog', create: 'Create', edit: 'Edit', projects: 'Projects', services: 'Services',
  testimonials: 'Testimonials', faq: 'FAQ', gallery: 'Gallery', media: 'Media Library',
  contact: 'Contact Messages', newsletter: 'Newsletter', settings: 'Website Settings',
  seo: 'SEO Settings', profile: 'Profile', password: 'Change Password', activity: 'Activity Log',
  users: 'Admin Users', login: 'Login',
}

export default function Breadcrumbs() {
  const { pathname } = useLocation()
  const segments = pathname.split('/').filter(Boolean)

  return (
    <nav className="flex items-center gap-1.5 text-sm">
      <Link to="/" className="flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {segments.map((seg, i) => {
        const to = '/' + segments.slice(0, i + 1).join('/')
        const isLast = i === segments.length - 1
        // Treat 24-char hex Mongo IDs as "Edit" rather than printing the raw id.
        const label = /^[0-9a-fA-F]{24}$/.test(seg) ? 'Edit' : LABELS[seg] || seg.charAt(0).toUpperCase() + seg.slice(1)
        return (
          <span key={to} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
            {isLast ? (
              <span className="font-medium text-slate-700 dark:text-slate-200">{label}</span>
            ) : (
              <Link to={to} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">{label}</Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
