import Container from '@/components/ui/Container'

const LOGOS = ['GAF', 'Owens Corning', 'CertainTeed', 'BBB A+', 'Angi', 'HomeAdvisor']

export default function TrustedBy() {
  return (
    <section className="border-y border-ink-100 bg-ink-50 py-10 dark:border-ink-900 dark:bg-ink-900/40">
      <Container>
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">
          Certified &amp; Trusted By
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {LOGOS.map((logo) => (
            <span key={logo} className="font-display text-lg font-medium text-ink-400 dark:text-ink-500">
              {logo}
            </span>
          ))}
        </div>
      </Container>
    </section>
  )
}
