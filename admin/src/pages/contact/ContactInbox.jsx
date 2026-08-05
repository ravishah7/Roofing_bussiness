import { useState } from 'react'
import { Mail, Phone, Trash2, Download, Search, ChevronLeft } from 'lucide-react'
import api from '@/lib/api'
import { useResourceList, useDeleteResource, useCustomMutation } from '@/hooks/useResource'
import PageHeader from '@/components/ui/PageHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Tabs from '@/components/ui/Tabs'
import StatusBadge from '@/components/ui/StatusBadge'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import EmptyState from '@/components/ui/EmptyState'
import Select from '@/components/forms/Select'
import { cn, formatDateTime, timeAgo } from '@/lib/utils'

const STATUS_TABS = [
  { value: '', label: 'All' }, { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' }, { value: 'resolved', label: 'Resolved' }, { value: 'spam', label: 'Spam' },
]

export default function ContactInbox() {
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [activeId, setActiveId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { data, isLoading } = useResourceList('contact', { limit: 50, status: status || undefined, search, sort: '-createdAt' })
  const deleteContact = useDeleteResource('contact', { successMessage: 'Message deleted' })
  const setContactStatus = useCustomMutation(
    ({ id, status: s }) => api.patch(`/contact/${id}/status`, { status: s }),
    { invalidate: ['contact'] }
  )

  const messages = data?.data || []
  const active = messages.find((m) => m._id === activeId) || messages[0]

  const exportCsv = () => {
    const header = 'name,email,phone,service,message,status,createdAt\n'
    const rows = messages
      .map((m) => [m.name, m.email, m.phone, m.service, `"${(m.message || '').replace(/"/g, '""')}"`, m.status, m.createdAt].join(','))
      .join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'contact-messages.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <PageHeader title="Contact Messages" description="Leads submitted through your website's contact form." actions={<Button variant="outline" icon={Download} onClick={exportCsv}>Export CSV</Button>} />

      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr]">
          {/* Inbox list */}
          <div className={cn('border-slate-100 dark:border-slate-800 lg:border-r', active && 'hidden lg:block')}>
            <div className="space-y-3 border-b border-slate-100 p-4 dark:border-slate-800">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search messages..." className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm focus:outline-none dark:border-slate-700 dark:bg-slate-800" />
              </div>
              <Tabs tabs={STATUS_TABS} active={status} onChange={setStatus} />
            </div>

            {isLoading ? (
              <div className="space-y-3 p-4">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 w-full rounded-lg" />)}</div>
            ) : messages.length === 0 ? (
              <EmptyState icon={Mail} title="No messages" description="Contact form submissions will appear here." />
            ) : (
              <div className="max-h-[640px] divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
                {messages.map((m) => (
                  <button
                    key={m._id}
                    onClick={() => setActiveId(m._id)}
                    className={cn('flex w-full flex-col items-start gap-1 px-4 py-3.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50', active?._id === m._id && 'bg-brand-50/60 dark:bg-brand-500/5')}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className={cn('truncate text-sm', m.status === 'new' ? 'font-semibold text-slate-900 dark:text-white' : 'font-medium text-slate-600 dark:text-slate-300')}>{m.name}</span>
                      <span className="shrink-0 text-[11px] text-slate-400">{timeAgo(m.createdAt)}</span>
                    </div>
                    <p className="line-clamp-1 text-xs text-slate-400">{m.message || m.service}</p>
                    <StatusBadge status={m.status} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Message detail */}
          <div className={cn('p-6', !active && 'hidden lg:flex')}>
            {!active ? (
              <div className="hidden h-full items-center justify-center text-sm text-slate-400 lg:flex">Select a message to view details</div>
            ) : (
              <div>
                <button onClick={() => setActiveId(null)} className="mb-4 flex items-center gap-1 text-sm text-slate-400 lg:hidden">
                  <ChevronLeft className="h-4 w-4" /> Back to inbox
                </button>

                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{active.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">{formatDateTime(active.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={active.status} onChange={(e) => setContactStatus.mutate({ id: active._id, status: e.target.value })} className="w-40">
                      <option value="new">New</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="spam">Spam</option>
                    </Select>
                    <button onClick={() => setDeleteTarget(active)} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-danger-100 hover:text-danger-500 dark:hover:bg-danger-500/15"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-4 text-sm">
                  <a href={`mailto:${active.email}`} className="flex items-center gap-1.5 text-brand-600 hover:underline dark:text-brand-400"><Mail className="h-4 w-4" /> {active.email}</a>
                  {active.phone && <a href={`tel:${active.phone}`} className="flex items-center gap-1.5 text-brand-600 hover:underline dark:text-brand-400"><Phone className="h-4 w-4" /> {active.phone}</a>}
                  {active.service && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">{active.service}</span>}
                </div>

                <div className="mt-6 whitespace-pre-wrap rounded-xl bg-slate-50 p-5 text-sm leading-relaxed text-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
                  {active.message || 'No message provided.'}
                </div>

                <a href={`mailto:${active.email}?subject=Re: Your inquiry to Summit Roof Co.`} className="mt-6 inline-block">
                  <Button icon={Mail}>Reply by Email</Button>
                </a>
              </div>
            )}
          </div>
        </div>
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete this message?"
        loading={deleteContact.isPending}
        onConfirm={() => deleteContact.mutate(deleteTarget._id, { onSuccess: () => { setDeleteTarget(null); setActiveId(null) } })}
      />
    </div>
  )
}
