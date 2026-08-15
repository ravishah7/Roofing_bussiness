function GoogleGIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
      <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z" />
      <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
    </svg>
  )
}

function relativeTime(dateString) {
  if (!dateString) return null
  const diffMs = Date.now() - new Date(dateString).getTime()
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (days < 1) return 'Today'
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`
  const years = Math.floor(months / 12)
  return `${years} year${years === 1 ? '' : 's'} ago`
}

export default function GoogleReviewCard({ testimonial }) {
  const t = testimonial
  const initial = t.name?.charAt(0)?.toUpperCase() || '?'
  const timeAgo = relativeTime(t.createdAt)

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-ink-800 dark:bg-ink-900">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {t.image?.url ? (
            <img src={t.image.url} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
          ) : (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ember-500 text-base font-semibold text-white">
              {initial}
            </span>
          )}
          <div>
            <p className="text-sm font-semibold text-ink-900 dark:text-white">{t.name}</p>
            <p className="text-xs text-ink-400">{t.location || timeAgo}</p>
          </div>
        </div>
        <GoogleGIcon className="h-6 w-6 shrink-0" />
      </div>

      <div className="mt-3 flex items-center gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <svg key={i} viewBox="0 0 20 20" className={`h-4 w-4 ${i < t.rating ? 'fill-[#FBBC04]' : 'fill-ink-200 dark:fill-ink-700'}`}>
            <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.9l-5.2 2.61.99-5.79-4.21-4.1 5.82-.85z" />
          </svg>
        ))}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink-600 dark:text-ink-400">{t.text}</p>

      <div className="mt-4 flex items-center gap-1.5 text-xs text-ink-400">
        <span>Posted on</span>
        <GoogleGIcon className="h-3.5 w-3.5" />
        <span className="font-medium">Google</span>
      </div>
    </div>
  )
}