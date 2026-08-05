import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import ProjectCard from '@/components/projects/ProjectCard'
import { useResourceList } from '@/hooks/useContentQueries'
import { normalizeProject } from '@/lib/normalizeProject'
import { PROJECTS as FALLBACK_PROJECTS } from '@/data/site'

export default function ProjectsPreview() {
  const { data, isLoading, isError } = useResourceList('projects', { limit: 3, sort: '-completionDate' })

  const live = data?.data
  const showFallback = isError || (!isLoading && (!live || live.length === 0))
  const projects = (live?.length ? live : showFallback ? FALLBACK_PROJECTS : []).map(normalizeProject)
  const showSkeleton = isLoading && projects.length === 0

  return (
    <section className="bg-ink-50 py-24 dark:bg-ink-900/30 md:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Our Work"
            title="Recently completed projects."
            description="A look at real roofs we've installed and restored across the region."
          />
          <Link to="/projects" className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-ember-600 hover:text-ember-700 dark:text-ember-400">
            View full gallery <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {showSkeleton ? (
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => <div key={i} className="aspect-[4/5] animate-pulse rounded-[2rem] bg-white dark:bg-ink-900/40" />)}
          </div>
        ) : (
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
          </div>
        )}
      </Container>
    </section>
  )
}
