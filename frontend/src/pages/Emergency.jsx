import { Phone, Clock, ShieldAlert, Siren } from 'lucide-react'
import Seo from '@/components/Seo'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import { useSettings } from '@/hooks/useSettings'

const STEPS = [
  { title: 'Call Now', desc: 'Reach our 24/7 emergency line and describe the damage.' },
  { title: 'Rapid Dispatch', desc: 'A crew is dispatched to tarp and stabilize the roof, day or night.' },
  { title: 'Full Assessment', desc: 'We document damage for insurance and schedule permanent repair.' },
]

export default function Emergency() {
  const { settings } = useSettings()
  const { emergencyPhone } = settings.business
  const cleanEmergencyPhone = emergencyPhone.replace(/[^\d+]/g, '')
  return (
    <>
      <Seo title="Emergency Roofing" description="24/7 emergency roof repair for storm damage and active leaks." path="/emergency-roofing" />
      <section className="relative overflow-hidden bg-ink-950 pb-20 pt-36 md:pb-28 md:pt-44">
        <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-ember-500/25 blur-[120px]" />
        <Container className="relative z-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-ember-500/15 px-4 py-2 text-xs font-semibold text-ember-400">
            <Siren className="h-4 w-4" /> 24/7 Emergency Response
          </span>
          <h1 className="mx-auto mt-6 max-w-2xl text-balance font-display text-4xl font-semibold text-white md:text-5xl">
            Active leak or storm damage? We're on our way.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-ink-300">
            Our emergency crews respond around the clock to stabilize your roof and prevent
            further damage — call now for immediate dispatch.
          </p>
          <div className="mt-10 flex justify-center">
            <Button as="a" href={`tel:${cleanEmergencyPhone}`} size="lg" icon={Phone} iconPosition="left">
              Call {emergencyPhone}
            </Button>
          </div>
        </Container>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-white roofline-up dark:bg-ink-950" />
      </section>

      <section className="bg-white py-20 dark:bg-ink-950 md:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="rounded-3xl border border-ink-100 p-8 dark:border-ink-800">
                <span className="font-display text-3xl font-semibold text-ember-500">0{i + 1}</span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink-900 dark:text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-ink-600 dark:text-ink-400">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-3xl bg-ink-50 p-10 dark:bg-ink-900/40 md:flex-row">
            <div className="flex items-center gap-4">
              <ShieldAlert className="h-8 w-8 shrink-0 text-ember-500" />
              <p className="text-sm text-ink-700 dark:text-ink-300">
                While you wait: avoid entering rooms with sagging ceilings, and place buckets under active leaks.
              </p>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-ink-500 dark:text-ink-400">
              <Clock className="h-4 w-4" /> Avg. response time: 45 minutes
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
