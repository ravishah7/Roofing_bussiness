import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Pencil, Trash2, HelpCircle, GripVertical } from 'lucide-react'
import api from '@/lib/api'
import { useResourceList, useCreateResource, useUpdateResource, useDeleteResource, useCustomMutation } from '@/hooks/useResource'
import { faqSchema } from '@/lib/schemas'
import PageHeader from '@/components/ui/PageHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import SearchBar from '@/components/ui/SearchBar'
import EmptyState from '@/components/ui/EmptyState'
import { TableSkeleton } from '@/components/ui/Skeleton'
import FormField from '@/components/forms/FormField'
import Input from '@/components/forms/Input'
import Textarea from '@/components/forms/Textarea'
import Switch from '@/components/forms/Switch'

export default function FaqList() {
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [items, setItems] = useState(null)
  const [dragIndex, setDragIndex] = useState(null)

  const { data, isLoading } = useResourceList('faqs', { limit: 100, search, sort: 'order' })
  const createOne = useCreateResource('faqs', { successMessage: 'FAQ added' })
  const updateOne = useUpdateResource('faqs', { successMessage: 'FAQ updated' })
  const deleteOne = useDeleteResource('faqs', { successMessage: 'FAQ deleted' })
  const reorder = useCustomMutation((order) => api.patch('/faqs/reorder', { order }), { invalidate: ['faqs'] })

  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(faqSchema) })

  const list = items || data?.data || []

  const openCreate = () => { setEditing(null); reset({ question: '', answer: '', category: 'General', isPublished: true }); setModalOpen(true) }
  const openEdit = (f) => { setEditing(f); reset({ question: f.question, answer: f.answer, category: f.category, isPublished: f.isPublished }); setModalOpen(true) }
  const onSubmit = (values) => {
    if (editing) updateOne.mutate({ id: editing._id, data: values })
    else createOne.mutate(values)
    setModalOpen(false)
  }

  const handleDrop = (dropIndex) => {
    if (dragIndex === null || dragIndex === dropIndex) return
    const next = [...list]
    const [moved] = next.splice(dragIndex, 1)
    next.splice(dropIndex, 0, moved)
    setItems(next)
    setDragIndex(null)
    reorder.mutate(next.map((f, i) => ({ id: f._id, order: i })))
  }

  return (
    <div>
      <PageHeader title="FAQ" description="Manage frequently asked questions. Drag to reorder." actions={<Button icon={Plus} onClick={openCreate}>New Question</Button>} />

      <Card>
        <div className="border-b border-slate-100 p-4 dark:border-slate-800">
          <SearchBar value={search} onChange={setSearch} placeholder="Search questions..." className="w-full sm:w-64" />
        </div>

        {isLoading ? (
          <TableSkeleton cols={3} />
        ) : list.length === 0 ? (
          <EmptyState icon={HelpCircle} title="No FAQs yet" description="Add your first question." actionLabel="New Question" onAction={openCreate} />
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {list.map((f, i) => (
              <div
                key={f._id}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(i)}
                className="flex cursor-grab items-start gap-3 px-6 py-4 active:cursor-grabbing"
              >
                <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-800 dark:text-slate-100">{f.question}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{f.answer}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">{f.category}</span>
                    {!f.isPublished && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-400 dark:bg-slate-800">Hidden</span>}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button onClick={() => openEdit(f)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => setDeleteTarget(f)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-danger-100 hover:text-danger-500 dark:hover:bg-danger-500/15"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Question' : 'New Question'}
        footer={<><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit(onSubmit)} loading={isSubmitting}>Save</Button></>}
      >
        <form className="space-y-5">
          <FormField label="Question" error={errors.question?.message} required><Input {...register('question')} error={!!errors.question} /></FormField>
          <FormField label="Answer" error={errors.answer?.message} required><Textarea rows={4} {...register('answer')} error={!!errors.answer} /></FormField>
          <FormField label="Category"><Input {...register('category')} placeholder="General" /></FormField>
          <Controller name="isPublished" control={control} render={({ field }) => (
            <Switch label="Visible on website" checked={!!field.value} onChange={field.onChange} />
          )} />
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete this question?"
        loading={deleteOne.isPending}
        onConfirm={() => deleteOne.mutate(deleteTarget._id, { onSuccess: () => setDeleteTarget(null) })}
      />
    </div>
  )
}
