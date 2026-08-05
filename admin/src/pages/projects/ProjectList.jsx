import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, FolderKanban, MapPin } from 'lucide-react'
import { useResourceList, useDeleteResource, useBulkDeleteResource } from '@/hooks/useResource'
import PageHeader from '@/components/ui/PageHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import DataTable from '@/components/ui/DataTable'
import SearchBar from '@/components/ui/SearchBar'
import Tabs from '@/components/ui/Tabs'
import StatusBadge from '@/components/ui/StatusBadge'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import EmptyState from '@/components/ui/EmptyState'
import { formatDate } from '@/lib/utils'

const STATUS_TABS = [{ value: '', label: 'All' }, { value: 'published', label: 'Published' }, { value: 'draft', label: 'Draft' }]

export default function ProjectList() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState('-completionDate')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { data, isLoading } = useResourceList('projects', { page, limit: 10, search, status: status || undefined, sort })
  const deleteProject = useDeleteResource('projects', { successMessage: 'Project deleted' })
  const bulkDelete = useBulkDeleteResource('projects')

  const columns = [
    {
      key: 'title', label: 'Project', sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.coverImage?.url ? (
            <img src={row.coverImage.url} alt="" className="h-9 w-9 rounded-lg object-cover" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-800"><FolderKanban className="h-4 w-4" /></span>
          )}
          <Link to={`/projects/${row._id}/edit`} className="line-clamp-1 font-medium text-slate-800 hover:text-brand-600 dark:text-slate-100">{row.title}</Link>
        </div>
      ),
    },
    {
      key: 'location', label: 'Location', sortable: false,
      render: (row) => row.location?.city ? <span className="flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" />{row.location.city}, {row.location.state}</span> : '—',
    },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'completionDate', label: 'Completed', sortable: true, render: (row) => formatDate(row.completionDate) },
    {
      key: 'actions', label: '', hideable: false, sortable: false,
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => navigate(`/projects/${row._id}/edit`)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"><Pencil className="h-4 w-4" /></button>
          <button onClick={() => setDeleteTarget(row)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-danger-100 hover:text-danger-500 dark:hover:bg-danger-500/15"><Trash2 className="h-4 w-4" /></button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title="Projects" description="Showcase completed roofing projects." actions={<Button icon={Plus} onClick={() => navigate('/projects/create')}>New Project</Button>} />
      <Card>
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <Tabs tabs={STATUS_TABS} active={status} onChange={(v) => { setStatus(v); setPage(1) }} />
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Search projects..." className="w-full sm:w-64" />
        </div>
        <DataTable
          columns={columns}
          data={data?.data || []}
          loading={isLoading}
          meta={data?.meta}
          page={page}
          onPageChange={setPage}
          sort={sort}
          onSortChange={setSort}
          emptyState={<EmptyState icon={FolderKanban} title="No projects yet" description="Add your first completed project." actionLabel="New Project" onAction={() => navigate('/projects/create')} />}
          bulkActions={[{ label: 'Delete', icon: Trash2, variant: 'danger', onClick: (ids) => bulkDelete.mutate(ids) }]}
        />
      </Card>
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete this project?"
        description={`"${deleteTarget?.title}" will be permanently deleted.`}
        loading={deleteProject.isPending}
        onConfirm={() => deleteProject.mutate(deleteTarget._id, { onSuccess: () => setDeleteTarget(null) })}
      />
    </div>
  )
}
