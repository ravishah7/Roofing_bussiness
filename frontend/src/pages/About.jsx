import { motion } from 'framer-motion'
import { ShieldCheck, Award, Users, HeartHandshake } from 'lucide-react'
import Seo from '@/components/Seo'
import PageHero from '@/components/ui/PageHero'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import StatsCounter from '@/components/home/StatsCounter'
import FinalCta from '@/components/home/FinalCta'

const VALUES = [
  { icon: ShieldCheck, title: 'Licensed & Insured', desc: 'Fully licensed, bonded, and insured in every market we serve.' },
  { icon: Award, title: 'Manufacturer Certified', desc: 'GAF Master Elite and Owens Corning Platinum Preferred credentials.' },
  { icon: Users, title: 'Employed, Not Subbed', desc: 'Every crew member is a direct employee — no day-labor subcontractors.' },
  { icon: HeartHandshake, title: 'Warranty Backed', desc: 'Workmanship warranties that stay honored for the life of your roof.' },
]

export default function About() {
  return (
    <>
      <Seo title="About Us" description="27 years of licensed, family-owned roofing craftsmanship." path="/about" />
      <PageHero eyebrow="About Summit Roof Co." title="Three generations of craftsmanship on every roof." crumb="About" description="Founded in 1999, we've grown from a two-truck operation to the region's most trusted roofing contractor — without ever losing the family-run standards we started with." floatingShapes />

      <section className="bg-white py-24 dark:bg-ink-950 md:py-32">
        <Container className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <motion.img
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop"
            alt="Roofing crew at work"
            className="aspect-[4/5] w-full rounded-3xl object-cover"
          />
          <div>
            <SectionHeading
              eyebrow="Our Story"
              title="Built on the roof, not in a boardroom."
              description="Summit Roof Co. started when our founder, a third-generation roofer, set out to build a company where every job was treated like it was on his own home. Today our licensed crews serve homeowners and businesses across the metro area, but the standard hasn't changed."
            />
            <div className="mt-10 grid grid-cols-2 gap-6">
              {VALUES.map((v) => (
                <div key={v.title}>
                  <v.icon className="h-6 w-6 text-ember-500" />
                  <h3 className="mt-3 font-display text-base font-semibold text-ink-900 dark:text-white">{v.title}</h3>
                  <p className="mt-1 text-sm text-ink-600 dark:text-ink-400">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <StatsCounter />
      <FinalCta />
    </>
  )
}
