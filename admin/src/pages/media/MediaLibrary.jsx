import { useRef, useState } from 'react'
import { Grid3x3, List, Upload, Trash2, Copy, Check, LibraryBig } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/api'
import { useResourceList, useDeleteResource, useCustomMutation } from '@/hooks/useResource'
import PageHeader from '@/components/ui/PageHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import SearchBar from '@/components/ui/SearchBar'
import Select from '@/components/forms/Select'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import EmptyState from '@/components/ui/EmptyState'
import Pagination from '@/components/ui/Pagination'
import { cn, formatDateTime } from '@/lib/utils'

export default function MediaLibrary() {
  const [view, setView] = useState('grid')
  const [search, setSearch] = useState('')
  const [folder, setFolder] = useState('')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const fileInputRef = useRef(null)

  const { data, isLoading } = useResourceList('media', { page, limit: 24, search, folder: folder || undefined })
  const { data: folders } = useResourceList('media/folders', {})
  const deleteMedia = useDeleteResource('media', { successMessage: 'File deleted' })
  const upload = useCustomMutation(
    (files) => {
      const form = new FormData()
      Array.from(files).forEach((f) => form.append('files', f))
      return api.post('/media/upload', form)
    },
    { successMessage: 'Files uploaded', invalidate: ['media'] }
  )

  const handleUpload = (e) => {
    if (e.target.files?.length) upload.mutate(e.target.files)
    e.target.value = ''
  }

  const copyUrl = (item) => {
    navigator.clipboard.writeText(item.url)
    setCopiedId(item._id)
    toast.success('URL copied')
    setTimeout(() => setCopiedId(null), 1500)
  }

  const items = data?.data || []

  return (
    <div>
      <PageHeader
        title="Media Library"
        description="All images uploaded across your blog, projects, services, and gallery."
        // actions={
        //   <>
        //     <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />
        //     <Button icon={Upload} loading={upload.isPending} onClick={() => fileInputRef.current?.click()}>Upload Files</Button>
        //   </>
        // }
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Search files..." className="w-full sm:w-64" />
            <Select value={folder} onChange={(e) => { setFolder(e.target.value); setPage(1) }} className="sm:w-56">
              <option value="">All folders</option>
              {(folders?.data || []).map((f) => <option key={f} value={f}>{f}</option>)}
            </Select>
          </div>
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            <button onClick={() => setView('grid')} className={cn('flex h-7 w-7 items-center justify-center rounded-md', view === 'grid' ? 'bg-white shadow-sm dark:bg-slate-700' : 'text-slate-400')}><Grid3x3 className="h-3.5 w-3.5" /></button>
            <button onClick={() => setView('list')} className={cn('flex h-7 w-7 items-center justify-center rounded-md', view === 'list' ? 'bg-white shadow-sm dark:bg-slate-700' : 'text-slate-400')}><List className="h-3.5 w-3.5" /></button>
          </div>
        </div>

{/* <EmptyState icon={LibraryBig} title="No media yet" description="Upload images to build your media library." actionLabel="Upload Files" onAction={() => fileInputRef.current?.click()} /> */}

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-4 lg:grid-cols-6">
            {[...Array(12)].map((_, i) => <div key={i} className="skeleton aspect-square rounded-xl" />)}
          </div>
        ) : items.length === 0 ? (
          <EmptyState icon={LibraryBig} title="No media yet" description="Upload images to build your media library."/>
        ) : view === 'grid' ? (     
          <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-4 lg:grid-cols-6">
            {items.map((item) => (
              <div key={item._id} className="group relative aspect-square overflow-hidden rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800">
                <img src={item.url} alt={item.fileName} className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-slate-900/0 opacity-0 transition-all group-hover:bg-slate-900/50 group-hover:opacity-100">
                  <button onClick={() => copyUrl(item)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-slate-700">
                    {copiedId === item._id ? <Check className="h-4 w-4 text-success-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <button onClick={() => setDeleteTarget(item)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-danger-500"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((item) => (
              <div key={item._id} className="flex items-center gap-4 px-6 py-3">
                <img src={item.url} alt="" className="h-10 w-10 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{item.fileName}</p>
                  <p className="text-xs text-slate-400">{item.folder} · {((item.size || 0) / 1024).toFixed(0)} KB · {formatDateTime(item.createdAt)}</p>
                </div>
                <button onClick={() => copyUrl(item)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                  {copiedId === item._id ? <Check className="h-4 w-4 text-success-500" /> : <Copy className="h-4 w-4" />}
                </button>
                <button onClick={() => setDeleteTarget(item)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-danger-100 hover:text-danger-500 dark:hover:bg-danger-500/15"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        )}

        {data?.meta && <Pagination page={page} totalPages={data.meta.totalPages} total={data.meta.total} limit={data.meta.limit} onPageChange={setPage} />}
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete this file?"
        description="This removes the file from Cloudinary permanently."
        loading={deleteMedia.isPending}
        onConfirm={() => deleteMedia.mutate(deleteTarget._id, { onSuccess: () => setDeleteTarget(null) })}
      />
    </div>
  )
}
