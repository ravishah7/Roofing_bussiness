import Seo from '@/components/Seo'
import PageHero from '@/components/ui/PageHero'
import Container from '@/components/ui/Container'
import { useSettings } from '@/hooks/useSettings'

export function PrivacyPolicy() {
  const { settings } = useSettings()
  const { name, email } = settings.business
  return (
    <>
      <Seo title="Privacy Policy" description={`How ${name} collects, uses, and protects your data.`} path="/privacy-policy" />
      <PageHero title="Privacy Policy" crumb="Privacy Policy" />
      <section className="bg-white py-20 dark:bg-ink-950">
        <Container className="max-w-3xl space-y-6 text-sm leading-relaxed text-ink-600 dark:text-ink-400">
          <p>Last updated: July 2026</p>
          <p>{name} (&quot;we,&quot; &quot;us&quot;) collects contact information you submit through our forms — such as your name, phone number, email, and project details — solely to respond to your inquiry and provide requested services.</p>
          <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">Information We Collect</h2>
          <p>Contact details submitted via our forms, and standard analytics data such as pages visited and browser type.</p>
          <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">How We Use It</h2>
          <p>To respond to inquiries, schedule inspections, send estimates, and improve our website experience. We do not sell your personal information.</p>
          <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">Your Choices</h2>
          <p>You may request access to, correction of, or deletion of your data at any time by contacting {email}.</p>
        </Container>
      </section>
    </>
  )
}

export function Terms() {
  const { settings } = useSettings()
  const { name } = settings.business
  return (
    <>
      <Seo title="Terms of Service" description={`Terms governing use of the ${name} website.`} path="/terms" />
      <PageHero title="Terms of Service" crumb="Terms" />
      <section className="bg-white py-20 dark:bg-ink-950">
        <Container className="max-w-3xl space-y-6 text-sm leading-relaxed text-ink-600 dark:text-ink-400">
          <p>Last updated: July 2026</p>
          <p>By using this website you agree to these terms. Content is provided for informational purposes and does not constitute a binding estimate until confirmed in a written proposal.</p>
          <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">Use of Site</h2>
          <p>You agree not to misuse this site, attempt unauthorized access to our systems, or reproduce site content without permission.</p>
          <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-white">Limitation of Liability</h2>
          <p>{name} is not liable for indirect damages arising from use of this website. Service agreements are governed by your signed project contract.</p>
        </Container>
      </section>
    </>
  )
}
