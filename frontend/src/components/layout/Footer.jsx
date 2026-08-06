import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react'
import Container from '@/components/ui/Container'
import { FacebookIcon, InstagramIcon, YoutubeIcon, TwitterIcon, LinkedinIcon } from '@/components/ui/SocialIcons'
import { useSettings } from '@/hooks/useSettings'
import { NAV_LINKS } from '@/data/site'
import { useResourceList } from '@/hooks/useContentQueries'

const SOCIAL_ICONS = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  twitter: TwitterIcon,
  linkedin: LinkedinIcon,
}

export default function Footer() {
  const { settings } = useSettings()
  const { name, phone, email, address, licenseNumber } = settings.business
  const socialLinks = Object.entries(settings.social).filter(([key, url]) => url && SOCIAL_ICONS[key])
  const addressLines = [address.street, [address.city, address.state, address.zip].filter(Boolean).join(', ')].filter(Boolean)
  const { data: servicesData } = useResourceList('services', { limit: 6, sort: 'order' })
const footerServices = servicesData?.data?.length ? servicesData.data : []

  return (
    <footer className="bg-ink-50 text-ink-600 dark:bg-ink-950 dark:text-ink-300">
      <Container className="grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-5 lg:py-20">
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2.5">
            {settings.logo?.url ? (
              <img src={settings.logo.url} alt={name} className="h-10 w-auto object-contain" />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ember-500 font-display text-lg font-bold text-white">
                {name.charAt(0)}
              </span>
            )}
            <span className="font-display text-xl font-semibold text-ink-900 dark:text-white">{name}</span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-500 dark:text-ink-400">
            {settings.business.tagline || 'Licensed, bonded, and insured roofing contractors serving the greater metro area. Residential and commercial roofing built to outlast the weather.'}
          </p>
          {socialLinks.length > 0 && (
            <div className="mt-6 flex gap-3">
              {socialLinks.map(([key, url]) => {
                const Icon = SOCIAL_ICONS[key]
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${key} link`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 text-ink-500 transition-colors hover:border-ember-500 hover:text-ember-500 dark:border-ink-800 dark:text-ink-400"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          )}
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-ink-900 dark:text-white">Company</h4>
          <ul className="mt-5 space-y-3 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link to={l.href} className="transition-colors hover:text-ember-600 dark:hover:text-ember-400">{l.label}</Link>
              </li>
            ))}
            <li><Link to="/faq" className="transition-colors hover:text-ember-600 dark:hover:text-ember-400">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-ink-900 dark:text-white">Services</h4>
          <ul className="mt-5 space-y-3 text-sm">
            {footerServices.map((s) => (
              <li key={s.slug}>
                <Link to={`/services/${s.slug}`} className="transition-colors hover:text-ember-600 dark:hover:text-ember-400">{s.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-ink-900 dark:text-white">Contact</h4>
          <ul className="mt-5 space-y-4 text-sm">
            {addressLines.length > 0 && (
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ember-500" />
                <span>{addressLines.map((line, i) => <span key={i}>{line}<br /></span>)}</span>
              </li>
            )}
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-ember-500" />
              <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="hover:text-ember-600 dark:hover:text-ember-400">{phone}</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-ember-500" />
              <a href={`mailto:${email}`} className="hover:text-ember-600 dark:hover:text-ember-400">{email}</a>
            </li>
          </ul>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-ember-600 hover:text-ember-700 dark:text-ember-500 dark:hover:text-ember-400"
          >
            Request an inspection <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>

      <div className="border-t border-ink-200 dark:border-ink-900">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 text-xs text-ink-500 dark:text-ink-500 md:flex-row">
          <p>© {new Date().getFullYear()} {name}. All rights reserved.{licenseNumber && ` License #${licenseNumber}.`}</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-ink-900 dark:hover:text-ink-300">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-ink-900 dark:hover:text-ink-300">Terms of Service</Link>
          </div>
        </Container>
      </div>
    </footer>
  )
}
