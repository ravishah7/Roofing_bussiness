import { MapPin } from 'lucide-react'
import Seo from '@/components/Seo'
import PageHero from '@/components/ui/PageHero'
import Container from '@/components/ui/Container'
import FinalCta from '@/components/home/FinalCta'
import { SERVICE_AREAS } from '@/data/site'

export default function ServiceAreas() {
  return (
    <>
      <Seo title="Service Areas" description="See the cities and suburbs we serve for residential and commercial roofing." path="/service-areas" />
      <PageHero eyebrow="Coverage" title="Where we work." crumb="Service Areas" description="Licensed crews serving the greater Chicago metro area — if your city isn't listed, call us, we likely still cover it." floatingShapes />
      <section className="bg-white py-20 dark:bg-ink-950 md:py-28">
        <Container>
          <div className="overflow-hidden rounded-3xl">
            <iframe
              title="Service area map"
              src="https://www.google.com/maps?q=Chicago,+IL&z=10&output=embed"
              className="h-80 w-full border-0"
              loading="lazy"
            />
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3 md:grid-cols-4">
            {SERVICE_AREAS.map((city) => (
              <div key={city} className="flex items-center gap-2 text-ink-700 dark:text-ink-300">
                <MapPin className="h-4 w-4 shrink-0 text-ember-500" /> {city}
              </div>
            ))}
          </div>
        </Container>
      </section>
      <FinalCta />
    </>
  )
}
