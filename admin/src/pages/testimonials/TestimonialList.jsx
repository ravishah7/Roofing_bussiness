import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Pencil, Trash2, Star, MessageSquareQuote, Check, X as XIcon, Video } from 'lucide-react'
import api from '@/lib/api'
import {
  useResourceList, useCreateResource, useUpdateResource, useDeleteResource, useCustomMutation,
} from '@/hooks/useResource'
import { testimonialSchema } from '@/lib/schemas'
import { getYoutubeThumbnail, isValidYoutubeUrl } from '@/lib/youtube'
import PageHeader from '@/components/ui/PageHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Tabs from '@/components/ui/Tabs'
import StatusBadge from '@/components/ui/StatusBadge'
import EmptyState from '@/components/ui/EmptyState'
import { TableSkeleton } from '@/components/ui/Skeleton'
import FormField from '@/components/forms/FormField'
import Input from '@/components/forms/Input'
import Textarea from '@/components/forms/Textarea'
import Select from '@/components/forms/Select'
import Switch from '@/components/forms/Switch'
 
const STATUS_TABS = [
  { value: '', label: 'All' }, { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' }, { value: 'rejected', label: 'Rejected' },
]
 
export default function TestimonialList() {
  const [status, setStatus] = useState('')
  const [editing, setEditing] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
 
  const { data, isLoading } = useResourceList('testimonials', { limit: 50, status: status || undefined, sort: '-createdAt' })
  const createOne = useCreateResource('testimonials', { successMessage: 'Testimonial added' })
  const updateOne = useUpdateResource('testimonials', { successMessage: 'Testimonial updated' })
  const deleteOne = useDeleteResource('testimonials', { successMessage: 'Testimonial deleted' })
  const setApproval = useCustomMutation(
    ({ id, status: s }) => api.patch(`/testimonials/${id}/status`, { status: s }),
    { successMessage: 'Status updated', invalidate: ['testimonials'] }
  )
 
  const { register, handleSubmit, reset, control, watch, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(testimonialSchema) })
 
  const videoUrl = watch('videoUrl')
  const previewThumb = getYoutubeThumbnail(videoUrl)
 
  const openCreate = () => { setEditing(null); reset({ name: '', location: '', rating: 5, text: '', videoUrl: '', isFeatured: false }); setModalOpen(true) }
  const openEdit = (t) => { setEditing(t); reset({ name: t.name, location: t.location || '', rating: t.rating, text: t.text, videoUrl: t.videoUrl || '', isFeatured: t.isFeatured }); setModalOpen(true) }
 
  const onSubmit = (values) => {
    if (editing) updateOne.mutate({ id: editing._id, data: values })
    else createOne.mutate(values)
    setModalOpen(false)
  }
 
  const list = data?.data || []
 
  return (
    <div>
      <PageHeader title="Testimonials" description="Customer reviews shown across your website." actions={<Button icon={Plus} onClick={openCreate}>New Testimonial</Button>} />
 
      <Card>
        <div className="border-b border-slate-100 p-4 dark:border-slate-800">
          <Tabs tabs={STATUS_TABS} active={status} onChange={setStatus} />
        </div>
 
        {isLoading ? (
          <TableSkeleton cols={5} />
        ) : list.length === 0 ? (
          <EmptyState icon={MessageSquareQuote} title="No testimonials yet" description="Add your first customer review." actionLabel="New Testimonial" onAction={openCreate} />
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {list.map((t) => (
              <div key={t._id} className="flex items-start gap-4 px-6 py-4">
                {t.image?.url ? (
                  <img src={t.image.url} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
                ) : (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white">{t.name[0]}</span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-800 dark:text-slate-100">{t.name}</p>
                    <StatusBadge status={t.status} />
                    {t.isFeatured && <span className="text-xs font-medium text-brand-600 dark:text-brand-400">★ Featured</span>}
                    {isValidYoutubeUrl(t.videoUrl) && (
                      <span className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 dark:bg-red-500/10 dark:text-red-400">
                        <Video className="h-3 w-3" /> Video
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex gap-0.5">
                    {[...Array(t.rating)].map((_, i) => <Star key={i} className="h-3 w-3 fill-warning-500 text-warning-500" />)}
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{t.text}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {t.status === 'pending' && (
                    <>
                      <button onClick={() => setApproval.mutate({ id: t._id, status: 'approved' })} className="flex h-8 w-8 items-center justify-center rounded-lg text-success-500 hover:bg-success-100 dark:hover:bg-success-500/15"><Check className="h-4 w-4" /></button>
                      <button onClick={() => setApproval.mutate({ id: t._id, status: 'rejected' })} className="flex h-8 w-8 items-center justify-center rounded-lg text-danger-500 hover:bg-danger-100 dark:hover:bg-danger-500/15"><XIcon className="h-4 w-4" /></button>
                    </>
                  )}
                  <button onClick={() => openEdit(t)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => setDeleteTarget(t)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-danger-100 hover:text-danger-500 dark:hover:bg-danger-500/15"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
 
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Testimonial' : 'New Testimonial'}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit(onSubmit)} loading={isSubmitting}>Save</Button>
          </>
        }
      >
        <form className="space-y-5">
          <FormField label="Name" error={errors.name?.message} required><Input {...register('name')} error={!!errors.name} /></FormField>
          <FormField label="Location"><Input {...register('location')} placeholder="Oak Park, IL" /></FormField>
          <FormField label="Rating">
            <Select {...register('rating')}>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}</Select>
          </FormField>
          <FormField label="Testimonial" error={errors.text?.message} required><Textarea rows={4} {...register('text')} error={!!errors.text} /></FormField>
 
          <FormField label="YouTube Video URL" error={errors.videoUrl?.message} hint="Optional — paste a YouTube link to show this as a video testimonial">
            <Input {...register('videoUrl')} error={!!errors.videoUrl} placeholder="https://www.youtube.com/watch?v=..." />
          </FormField>
          {previewThumb && (
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
              <img src={previewThumb} alt="" className="h-14 w-24 rounded-lg object-cover" />
              <p className="text-xs text-slate-500 dark:text-slate-400">This is how the video thumbnail will appear on the site.</p>
            </div>
          )}
          {videoUrl && !previewThumb && (
            <p className="text-xs text-danger-500">This doesn't look like a valid YouTube URL — the video won't display until it's fixed.</p>
          )}
 
          <Controller
            name="isFeatured"
            control={control}
            render={({ field }) => (
              <Switch label="Featured on homepage" checked={!!field.value} onChange={field.onChange} />
            )}
          />
        </form>
      </Modal>
 
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete this testimonial?"
        loading={deleteOne.isPending}
        onConfirm={() => deleteOne.mutate(deleteTarget._id, { onSuccess: () => setDeleteTarget(null) })}
      />
    </div>
  )
}
 