import { Clock, Printer } from 'lucide-react'
import Seo from '@/components/Seo'
import PageHero from '@/components/ui/PageHero'
import Container from '@/components/ui/Container'
import { useSettings } from '@/hooks/useSettings'

const DEFAULT_PRIVACY = `Information We Collect

We collect contact details submitted via our forms, and standard analytics data such as pages visited and browser type.

How We Use It

To respond to inquiries, schedule inspections, send estimates, and improve our website experience. We do not sell your personal information.

Your Choices

You may request access to, correction of, or deletion of your data at any time by contacting us.`

const DEFAULT_TERMS = `Use of Site

By using this website you agree to these terms. Content is provided for informational purposes and does not constitute a binding estimate until confirmed in a written proposal.

Limitation of Liability

We are not liable for indirect damages arising from use of this website. Service agreements are governed by your signed project contract.`

function LegalPage({ title, crumb, description, content, updatedAt }) {
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)

  return (
    <>
      <Seo title={title} description={description} path={`/${crumb.toLowerCase().replace(/\s+/g, '-')}`} />

      <div className="print:hidden">
        <PageHero title={title} crumb={crumb} />
      </div>

      <section className="bg-white py-20 dark:bg-ink-950 print:bg-white print:py-0 print:dark:bg-white">
        <Container className="max-w-3xl print:max-w-none">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-ink-100 pb-6 dark:border-ink-800 print:hidden">
            <span className="flex items-center gap-2 rounded-full bg-ink-50 px-3.5 py-1.5 text-xs font-medium text-ink-500 dark:bg-ink-900 dark:text-ink-400">
              <Clock className="h-3.5 w-3.5" /> Last updated: {updatedAt}
            </span>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-full border border-ink-200 px-3.5 py-1.5 text-xs font-medium text-ink-600 transition-colors hover:border-ember-500 hover:text-ember-600 dark:border-ink-700 dark:text-ink-300 dark:hover:border-ember-400 dark:hover:text-ember-400"
            >
              <Printer className="h-3.5 w-3.5" /> Print
            </button>
          </div>

          <div id="legal-print-content">
            <h1 className="hidden text-2xl font-semibold text-ink-900 print:mb-6 print:block">{title}</h1>
            <p className="hidden text-sm text-ink-500 print:mb-8 print:block">Last updated: {updatedAt}</p>

            <div className="space-y-6 print:space-y-4">
              {paragraphs.map((block, i) => (
                <p key={i} className="whitespace-pre-line text-base leading-relaxed text-ink-600 dark:text-ink-400 print:text-black">
                  {block}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

export function PrivacyPolicy() {
  const { settings } = useSettings()
  const { name } = settings.business
  const content = settings.legalContent?.privacyPolicy || DEFAULT_PRIVACY
  const updatedAt = settings.legalContent?.privacyUpdatedAt
    ? new Date(settings.legalContent.privacyUpdatedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'July 2026'

  return (
    <LegalPage
      title="Privacy Policy"
      crumb="Privacy Policy"
      description={`How ${name} collects, uses, and protects your data.`}
      content={content}
      updatedAt={updatedAt}
    />
  )
}

export function Terms() {
  const { settings } = useSettings()
  const { name } = settings.business
  const content = settings.legalContent?.termsOfService || DEFAULT_TERMS
  const updatedAt = settings.legalContent?.termsUpdatedAt
    ? new Date(settings.legalContent.termsUpdatedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'July 2026'

  return (
    <LegalPage
      title="Terms of Service"
      crumb="Terms"
      description={`Terms governing use of the ${name} website.`}
      content={content}
      updatedAt={updatedAt}
    />
  )
}