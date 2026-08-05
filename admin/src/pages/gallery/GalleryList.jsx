import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Pencil, Trash2, Images } from 'lucide-react'
import { useResourceList, useCreateResource, useUpdateResource, useDeleteResource } from '@/hooks/useResource'
import { albumSchema } from '@/lib/schemas'
import PageHeader from '@/components/ui/PageHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import StatusBadge from '@/components/ui/StatusBadge'
import EmptyState from '@/components/ui/EmptyState'
import FormField from '@/components/forms/FormField'
import Input from '@/components/forms/Input'
import Textarea from '@/components/forms/Textarea'
import Select from '@/components/forms/Select'
import ImageUpload from '@/components/forms/ImageUpload'

export default function GalleryList() {
  const [editing, setEditing] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  const { data, isLoading } = useResourceList('gallery', { limit: 100, sort: '-createdAt' })
  const createAlbum = useCreateResource('gallery', { successMessage: 'Album created' })
  const updateAlbum = useUpdateResource('gallery', { successMessage: 'Album updated' })
  const deleteAlbum = useDeleteResource('gallery', { successMessage: 'Album deleted' })

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(albumSchema) })

  const openCreate = () => {
    setEditing(null); reset({ title: '', description: '', status: 'published' })
    setCoverFile(null); setCoverPreview(null); setImageFiles([]); setImagePreviews([])
    setModalOpen(true)
  }
  const openEdit = (a) => {
    setEditing(a); reset({ title: a.title, description: a.description || '', status: a.status })
    setCoverPreview(a.coverImage?.url || null); setCoverFile(null)
    setImagePreviews((a.images || []).map((i) => i.url)); setImageFiles([])
    setModalOpen(true)
  }

  const onSubmit = (values) => {
    const form = new FormData()
    form.append('title', values.title)
    form.append('description', values.description || '')
    form.append('status', values.status)
    if (coverFile) form.append('coverImage', coverFile)
    imageFiles.forEach((f) => form.append('images', f))

    if (editing) updateAlbum.mutate({ id: editing._id, data: form }, { onSuccess: () => setModalOpen(false) })
    else createAlbum.mutate(form, { onSuccess: () => setModalOpen(false) })
  }

  const albums = data?.data || []
  const saving = createAlbum.isPending || updateAlbum.isPending

  return (
    <div>
      <PageHeader title="Gallery" description="Organize photos into albums for your public gallery page." actions={<Button icon={Plus} onClick={openCreate}>New Album</Button>} />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton aspect-[4/3] rounded-2xl" />)}
        </div>
      ) : albums.length === 0 ? (
        <Card><EmptyState icon={Images} title="No albums yet" description="Create your first photo album." actionLabel="New Album" onAction={openCreate} /></Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((a) => (
            <Card key={a._id} className="group overflow-hidden">
              <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800">
                {a.coverImage?.url ? (
                  <img src={a.coverImage.url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-300"><Images className="h-8 w-8" /></div>
                )}
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => openEdit(a)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-slate-600 shadow"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => setDeleteTarget(a)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-danger-500 shadow"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-800 dark:text-slate-100">{a.title}</p>
                  <StatusBadge status={a.status} />
                </div>
                <p className="mt-1 text-xs text-slate-400">{a.images?.length || 0} photos</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        size="lg"
        title={editing ? 'Edit Album' : 'New Album'}
        footer={<><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit(onSubmit)} loading={saving}>Save</Button></>}
      >
        <form className="space-y-5">
          <FormField label="Title" error={errors.title?.message} required><Input {...register('title')} error={!!errors.title} /></FormField>
          <FormField label="Description"><Textarea rows={2} {...register('description')} /></FormField>
          <FormField label="Status"><Select {...register('status')}><option value="published">Published</option><option value="draft">Draft</option></Select></FormField>
          <FormField label="Cover Image">
            <ImageUpload value={coverPreview} onFilesSelected={([f]) => { setCoverFile(f); setCoverPreview(URL.createObjectURL(f)) }} onRemove={() => { setCoverFile(null); setCoverPreview(null) }} />
          </FormField>
          <FormField label="Album Images" hint="Drag & drop multiple photos">
            <ImageUpload
              multiple
              value={imagePreviews}
              onFilesSelected={(files) => { setImageFiles((f) => [...f, ...files]); setImagePreviews((p) => [...p, ...files.map((f) => URL.createObjectURL(f))]) }}
              onRemove={(i) => { setImageFiles((f) => f.filter((_, idx) => idx !== i)); setImagePreviews((p) => p.filter((_, idx) => idx !== i)) }}
            />
          </FormField>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete this album?"
        description={`"${deleteTarget?.title}" and all its photos will be permanently deleted.`}
        loading={deleteAlbum.isPending}
        onConfirm={() => deleteAlbum.mutate(deleteTarget._id, { onSuccess: () => setDeleteTarget(null) })}
      />
    </div>
  )
}
