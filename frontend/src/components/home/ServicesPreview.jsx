import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import ServiceCard from '@/components/services/ServiceCard'
import { useResourceList } from '@/hooks/useContentQueries'
import { normalizeService } from '@/lib/normalizeService'
import { SERVICES as FALLBACK_SERVICES } from '@/data/site'

export default function ServicesPreview() {
  const { data, isLoading, isError } = useResourceList('services', { limit: 6, sort: 'order' })

  const live = data?.data
  const showFallback = isError || (!isLoading && (!live || live.length === 0))
  const services = (live?.length ? live : showFallback ? FALLBACK_SERVICES : []).map(normalizeService)
  const showSkeleton = isLoading && services.length === 0

  return (
    <section className="bg-white py-24 dark:bg-ink-950 md:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="What We Do"
            title="Complete roofing services, one trusted crew."
            description="From a single repair to a full commercial re-roof — every job is handled by our own licensed crews, never subcontracted out."
          />
          <Link to="/services" className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-ember-600 hover:text-ember-700 dark:text-ember-400">
            View all services <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {showSkeleton ? (
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => <div key={i} className="aspect-[4/3] animate-pulse rounded-[2rem] bg-ink-50 dark:bg-ink-900/40" />)}
          </div>
        ) : (
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
          </div>
        )}
      </Container>
    </section>
  )
}
