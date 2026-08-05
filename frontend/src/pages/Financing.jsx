import { CheckCircle2, CreditCard, Calculator } from 'lucide-react'
import { Link } from 'react-router-dom'
import Seo from '@/components/Seo'
import PageHero from '@/components/ui/PageHero'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'
import FinalCta from '@/components/home/FinalCta'

const PLANS = [
  { name: 'Standard', rate: '9.99% APR', term: '60 months', best: false },
  { name: 'Promo 0%', rate: '0% APR', term: '18 months', best: true },
  { name: 'Low Monthly', rate: '6.99% APR', term: '120 months', best: false },
]

export default function Financing() {
  return (
    <>
      <Seo title="Financing Options" description="Flexible roofing financing plans with same-day approval." path="/financing" />
      <PageHero eyebrow="Financing" title="Get the roof you need, on terms that work." crumb="Financing" description="We partner with leading lenders to offer flexible plans with same-day approval decisions." />
      <section className="bg-white py-20 dark:bg-ink-950 md:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div key={plan.name} className={`relative rounded-3xl border p-8 ${plan.best ? 'border-ember-500 shadow-xl shadow-ember-500/10' : 'border-ink-100 dark:border-ink-800'}`}>
                {plan.best && <span className="absolute -top-3 left-8 rounded-full bg-ember-500 px-3 py-1 text-xs font-semibold text-white">Most Popular</span>}
                <CreditCard className="h-8 w-8 text-ember-500" />
                <h3 className="mt-5 font-display text-xl font-semibold text-ink-900 dark:text-white">{plan.name}</h3>
                <p className="mt-2 text-3xl font-semibold text-ink-900 dark:text-white">{plan.rate}</p>
                <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">up to {plan.term}</p>
                <ul className="mt-6 space-y-2 text-sm text-ink-600 dark:text-ink-400">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-ember-500" /> No prepayment penalty</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-ember-500" /> Same-day decision</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-ember-500" /> Fixed monthly payment</li>
                </ul>
                <Button as={Link} to="/contact" variant={plan.best ? 'primary' : 'outline'} className="mt-8 w-full justify-center">Apply Now</Button>
              </div>
            ))}
          </div>

          <div className="mt-16 flex items-center gap-4 rounded-3xl border border-ink-100 p-8 dark:border-ink-800">
            <Calculator className="h-10 w-10 shrink-0 text-ember-500" />
            <div>
              <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-white">Not sure what fits your budget?</h3>
              <p className="mt-1 text-sm text-ink-600 dark:text-ink-400">Our team can walk you through payment estimates during your free inspection.</p>
            </div>
          </div>
        </Container>
      </section>
      <FinalCta />
    </>
  )
}
