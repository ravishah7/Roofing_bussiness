import { useQuery } from '@tanstack/react-query'
import { FileText, FolderKanban, Mail, Info } from 'lucide-react'
import api from '@/lib/api'
import PageHeader from '@/components/ui/PageHeader'
import Card, { CardContent } from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import StatusBadge from '@/components/ui/StatusBadge'
import { timeAgo } from '@/lib/utils'

const TYPE_ICON = { blog: FileText, project: FolderKanban, contact: Mail }

export default function ActivityLog() {
  const { data, isLoading } = useQuery({
    queryKey: ['activity-derived'],
    queryFn: async () => {
      const [blogs, projects, contacts] = await Promise.all([
        api.get('/dashboard/recent-blogs', { params: { limit: 10 } }),
        api.get('/dashboard/recent-projects', { params: { limit: 10 } }),
        api.get('/dashboard/recent-contacts', { params: { limit: 10 } }),
      ])
      const events = [
        ...blogs.data.data.map((b) => ({ type: 'blog', title: b.title, meta: b.status, date: b.createdAt, id: b._id })),
        ...projects.data.data.map((p) => ({ type: 'project', title: p.title, meta: p.status, date: p.completionDate || p.createdAt, id: p._id })),
        ...contacts.data.data.map((c) => ({ type: 'contact', title: `${c.name} submitted a message`, meta: c.status, date: c.createdAt, id: c._id })),
      ]
      return events.sort((a, b) => new Date(b.date) - new Date(a.date))
    },
  })

  return (
    <div>
      <PageHeader title="Activity Log" description="Recent content and lead activity across your website." />

      <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-info-100 bg-info-100/40 px-4 py-3 text-sm text-slate-600 dark:border-info-500/20 dark:bg-info-500/10 dark:text-slate-300">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-info-500" />
        This view is derived from recent blogs, projects, and messages — there isn't a dedicated audit-log
        table on the backend yet, so per-field change history (who edited what) isn't tracked.
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-4 p-6">{[...Array(6)].map((_, i) => <div key={i} className="skeleton h-12 w-full rounded-lg" />)}</div>
          ) : !data?.length ? (
            <EmptyState title="No recent activity" description="Activity will appear here as content is created." />
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.map((event) => {
                const Icon = TYPE_ICON[event.type]
                return (
                  <div key={`${event.type}-${event.id}`} className="flex items-center gap-4 px-6 py-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-slate-700 dark:text-slate-300">{event.title}</p>
                    </div>
                    <StatusBadge status={event.meta} />
                    <span className="shrink-0 text-xs text-slate-400">{timeAgo(event.date)}</span>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
