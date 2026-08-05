import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Wrench, GripVertical } from 'lucide-react'
import { useResourceList, useDeleteResource } from '@/hooks/useResource'
import { useCustomMutation } from '@/hooks/useResource'
import api from '@/lib/api'
import PageHeader from '@/components/ui/PageHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import SearchBar from '@/components/ui/SearchBar'
import StatusBadge from '@/components/ui/StatusBadge'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import EmptyState from '@/components/ui/EmptyState'
import { TableSkeleton } from '@/components/ui/Skeleton'

export default function ServiceList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [items, setItems] = useState(null)
  const [dragIndex, setDragIndex] = useState(null)

  const { data, isLoading } = useResourceList('services', { limit: 100, search, sort: 'order' })
  const deleteService = useDeleteResource('services', { successMessage: 'Service deleted' })
  const reorder = useCustomMutation((order) => api.patch('/services/reorder', { order }), { invalidate: ['services'] })

  const list = items || data?.data || []

  const handleDrop = (dropIndex) => {
    if (dragIndex === null || dragIndex === dropIndex) return
    const next = [...list]
    const [moved] = next.splice(dragIndex, 1)
    next.splice(dropIndex, 0, moved)
    setItems(next)
    setDragIndex(null)
    reorder.mutate(next.map((s, i) => ({ id: s._id, order: i })))
  }

  return (
    <div>
      <PageHeader title="Services" description="Manage the services offered on your website. Drag rows to reorder." actions={<Button icon={Plus} onClick={() => navigate('/services/create')}>New Service</Button>} />

      <Card>
        <div className="border-b border-slate-100 p-4 dark:border-slate-800">
          <SearchBar value={search} onChange={setSearch} placeholder="Search services..." className="w-full sm:w-64" />
        </div>

        {isLoading ? (
          <TableSkeleton cols={4} />
        ) : list.length === 0 ? (
          <EmptyState icon={Wrench} title="No services yet" description="Add the services your company offers." actionLabel="New Service" onAction={() => navigate('/services/create')} />
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {list.map((s, i) => (
              <div
                key={s._id}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(i)}
                className="flex cursor-grab items-center gap-4 px-6 py-3.5 active:cursor-grabbing"
              >
                <GripVertical className="h-4 w-4 shrink-0 text-slate-300" />
                {s.coverImage?.url ? (
                  <img src={s.coverImage.url} alt="" className="h-9 w-9 rounded-lg object-cover" />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-800"><Wrench className="h-4 w-4" /></span>
                )}
                <div className="min-w-0 flex-1">
                  <Link to={`/services/${s._id}/edit`} className="font-medium text-slate-800 hover:text-brand-600 dark:text-slate-100">{s.title}</Link>
                  <p className="line-clamp-1 text-xs text-slate-400">{s.shortDescription}</p>
                </div>
                <StatusBadge status={s.status} />
                <div className="flex items-center gap-1">
                  <button onClick={() => navigate(`/services/${s._id}/edit`)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => setDeleteTarget(s)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-danger-100 hover:text-danger-500 dark:hover:bg-danger-500/15"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete this service?"
        description={`"${deleteTarget?.title}" will be permanently deleted.`}
        loading={deleteService.isPending}
        onConfirm={() => deleteService.mutate(deleteTarget._id, { onSuccess: () => setDeleteTarget(null) })}
      />
    </div>
  )
}
