import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, CheckCircle2, FileText } from 'lucide-react'
import { useResourceList, useDeleteResource, useBulkDeleteResource, useUpdateResource } from '@/hooks/useResource'
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

const STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
]

export default function BlogList() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState('-createdAt')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { data, isLoading } = useResourceList('blogs', { page, limit: 10, search, status: status || undefined, sort })
  const deleteBlog = useDeleteResource('blogs', { successMessage: 'Blog post deleted' })
  const updateBlog = useUpdateResource('blogs', { successMessage: 'Status updated' })
  const bulkDelete = useBulkDeleteResource('blogs')

  const columns = [
    {
      key: 'title', label: 'Title', sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.featuredImage?.url ? (
            <img src={row.featuredImage.url} alt="" className="h-9 w-9 rounded-lg object-cover" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-800">
              <FileText className="h-4 w-4" />
            </span>
          )}
          <div className="min-w-0">
            <Link to={`/blog/${row._id}/edit`} className="line-clamp-1 font-medium text-slate-800 hover:text-brand-600 dark:text-slate-100">
              {row.title}
            </Link>
            <p className="text-xs text-slate-400">{row.category?.name || 'Uncategorized'}</p>
          </div>
        </div>
      ),
    },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'views', label: 'Views', sortable: true },
    { key: 'createdAt', label: 'Created', sortable: true, render: (row) => formatDate(row.createdAt) },
    {
      key: 'actions', label: '', hideable: false, sortable: false,
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => navigate(`/blog/${row._id}/edit`)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => setDeleteTarget(row)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-danger-100 hover:text-danger-500 dark:hover:bg-danger-500/15">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Blog"
        description="Write, publish, and manage your blog posts."
        actions={<Button icon={Plus} onClick={() => navigate('/blog/create')}>New Post</Button>}
      />

      <Card>
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <Tabs tabs={STATUS_TABS} active={status} onChange={(v) => { setStatus(v); setPage(1) }} />
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Search posts..." className="w-full sm:w-64" />
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
          emptyState={
            <EmptyState
              icon={FileText}
              title="No blog posts yet"
              description="Create your first post to start building your content library."
              actionLabel="New Post"
              onAction={() => navigate('/blog/create')}
            />
          }
          bulkActions={[
            {
              label: 'Publish',
              icon: CheckCircle2,
              onClick: (ids) => ids.forEach((id) => updateBlog.mutate({ id, data: { status: 'published' } })),
            },
            {
              label: 'Delete',
              icon: Trash2,
              variant: 'danger',
              onClick: (ids) => bulkDelete.mutate(ids),
            },
          ]}
        />
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete this blog post?"
        description={`"${deleteTarget?.title}" will be permanently deleted.`}
        loading={deleteBlog.isPending}
        onConfirm={() =>
          deleteBlog.mutate(deleteTarget._id, { onSuccess: () => setDeleteTarget(null) })
        }
      />
    </div>
  )
}
