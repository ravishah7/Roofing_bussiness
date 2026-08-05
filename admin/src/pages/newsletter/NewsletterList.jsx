import { useState } from 'react'
import { Trash2, Download, Send } from 'lucide-react'
import api from '@/lib/api'
import { useResourceList, useDeleteResource } from '@/hooks/useResource'
import PageHeader from '@/components/ui/PageHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import DataTable from '@/components/ui/DataTable'
import SearchBar from '@/components/ui/SearchBar'
import StatusBadge from '@/components/ui/StatusBadge'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import EmptyState from '@/components/ui/EmptyState'
import { formatDate } from '@/lib/utils'

export default function NewsletterList() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { data, isLoading } = useResourceList('newsletter', { page, limit: 15, search, sort: '-createdAt' })
  const deleteSub = useDeleteResource('newsletter', { successMessage: 'Subscriber deleted' })

  const exportCsv = async () => {
    const res = await api.get('/newsletter/export', { responseType: 'blob' })
    const url = URL.createObjectURL(res.data)
    const a = document.createElement('a')
    a.href = url
    a.download = 'newsletter-subscribers.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const columns = [
    { key: 'email', label: 'Email', sortable: true },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'subscribedAt', label: 'Subscribed', sortable: true, render: (row) => formatDate(row.subscribedAt) },
    {
      key: 'actions', label: '', hideable: false, sortable: false,
      render: (row) => (
        <div className="flex justify-end">
          <button onClick={() => setDeleteTarget(row)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-danger-100 hover:text-danger-500 dark:hover:bg-danger-500/15"><Trash2 className="h-4 w-4" /></button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title="Newsletter" description="Subscribers collected from your website's newsletter signup." actions={<Button variant="outline" icon={Download} onClick={exportCsv}>Export CSV</Button>} />

      <Card>
        <div className="border-b border-slate-100 p-4 dark:border-slate-800">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Search subscribers..." className="w-full sm:w-64" />
        </div>
        <DataTable
          columns={columns}
          data={data?.data || []}
          loading={isLoading}
          meta={data?.meta}
          page={page}
          onPageChange={setPage}
          selectable={false}
          emptyState={<EmptyState icon={Send} title="No subscribers yet" description="Newsletter signups from your website will appear here." />}
        />
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Remove this subscriber?"
        loading={deleteSub.isPending}
        onConfirm={() => deleteSub.mutate(deleteTarget._id, { onSuccess: () => setDeleteTarget(null) })}
      />
    </div>
  )
}
