import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft } from 'lucide-react'
import { useResourceItem, useCreateResource, useUpdateResource, useResourceList } from '@/hooks/useResource'
import { projectSchema } from '@/lib/schemas'
import { cn } from '@/lib/utils'
import PageHeader from '@/components/ui/PageHeader'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import FormField from '@/components/forms/FormField'
import Input from '@/components/forms/Input'
import Textarea from '@/components/forms/Textarea'
import Select from '@/components/forms/Select'
import ImageUpload from '@/components/forms/ImageUpload'
 
/**
 * Builds the initial unified item list for a multi-image field from
 * existing server images. Each item is either:
 *   - existing:  { id, url, publicId, alt, file: null }
 *   - newly picked: { id, url (blob), file, publicId: undefined }
 * Keeping ONE array (instead of separate files[]/previews[]) means
 * indices never drift out of sync between what's displayed and what's
 * removed/submitted.
 */
function itemsFromExisting(images = []) {
  return images.map((img) => ({
    id: img.publicId || img.url,
    url: img.url,
    publicId: img.publicId,
    alt: img.alt || '',
    file: null,
  }))
}
 
function MultiImageField({ label, items, setItems }) {
  return (
    <FormField label={label}>
      <ImageUpload
        multiple
        value={items.map((it) => it.url)}
        onFilesSelected={(newFiles) => {
          setItems((prev) => [
            ...prev,
            ...newFiles.map((file) => ({
              id: `new-${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
              url: URL.createObjectURL(file),
              file,
              publicId: undefined,
            })),
          ])
        }}
        onRemove={(i) => setItems((prev) => prev.filter((_, idx) => idx !== i))}
      />
    </FormField>
  )
}
 
export default function ProjectForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
 
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [galleryItems, setGalleryItems] = useState([])
  const [beforeItems, setBeforeItems] = useState([])
  const [afterItems, setAfterItems] = useState([])
  const [servicesUsed, setServicesUsed] = useState([])
 
  const { data: existing, isLoading } = useResourceItem('projects', isEdit ? id : null)
  const { data: servicesRes } = useResourceList('services', { limit: 100, status: 'published' })
  const { data: categoriesRes } = useResourceList('categories', { limit: 100, sort: 'name' })
  const createProject = useCreateResource('projects', { successMessage: 'Project created' })
  const updateProject = useUpdateResource('projects', { successMessage: 'Project updated' })
 
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: { title: '', description: '', city: '', state: '', completionDate: '', status: 'draft', customerName: '', customerRating: 5, customerReview: '', category: '' },
  })
 
  useEffect(() => {
    if (existing) {
      reset({
        title: existing.title,
        description: existing.description,
        city: existing.location?.city || '',
        state: existing.location?.state || '',
        completionDate: existing.completionDate ? existing.completionDate.slice(0, 10) : '',
        status: existing.status,
        customerName: existing.customerReview?.name || '',
        customerRating: existing.customerReview?.rating || 5,
        customerReview: existing.customerReview?.text || '',
        category: typeof existing.category === 'object' ? existing.category?._id : existing.category || '',
      })
      setCoverPreview(existing.coverImage?.url || null)
      setGalleryItems(itemsFromExisting(existing.gallery))
      setBeforeItems(itemsFromExisting(existing.beforeImages))
      setAfterItems(itemsFromExisting(existing.afterImages))
      setServicesUsed((existing.servicesUsed || []).map((s) => s._id || s))
    }
  }, [existing, reset])
 
  const onSubmit = (values) => {
    const form = new FormData()
    form.append('title', values.title)
    form.append('description', values.description)
    form.append('status', values.status)
    if (values.category) form.append('category', values.category)
    if (values.city) form.append('location', JSON.stringify({ city: values.city, state: values.state }))
    if (values.completionDate) form.append('completionDate', values.completionDate)
    if (values.customerName) {
      form.append('customerReview', JSON.stringify({ name: values.customerName, rating: values.customerRating, text: values.customerReview }))
    }
    servicesUsed.forEach((s) => form.append('servicesUsed[]', s))
 
    if (coverFile) form.append('coverImage', coverFile)
 
    // For each multi-image field: tell the backend which existing images
    // survived (so it can delete whatever was removed), then attach any
    // newly picked files under the same field name as before.
    const appendMultiImageField = (fieldName, items) => {
      const survivors = items.filter((it) => !it.file).map(({ url, publicId, alt }) => ({ url, publicId, alt }))
      form.append(`${fieldName}Existing`, JSON.stringify(survivors))
      items.filter((it) => it.file).forEach((it) => form.append(fieldName, it.file))
    }
 
    if (isEdit) {
      appendMultiImageField('gallery', galleryItems)
      appendMultiImageField('beforeImages', beforeItems)
      appendMultiImageField('afterImages', afterItems)
    } else {
      // On create there's nothing existing to reconcile — just send the
      // picked files directly, matching the original behavior.
      galleryItems.forEach((it) => it.file && form.append('gallery', it.file))
      beforeItems.forEach((it) => it.file && form.append('beforeImages', it.file))
      afterItems.forEach((it) => it.file && form.append('afterImages', it.file))
    }
 
    if (isEdit) {
      updateProject.mutate({ id, data: form }, { onSuccess: () => navigate('/projects') })
    } else {
      createProject.mutate(form, { onSuccess: () => navigate('/projects') })
    }
  }
 
  const saving = createProject.isPending || updateProject.isPending
  const toggleService = (id) => setServicesUsed((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
 
  if (isEdit && isLoading) return <div className="skeleton h-96 w-full rounded-2xl" />
 
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PageHeader
        title={isEdit ? 'Edit Project' : 'New Project'}
        actions={
          <>
            <Button type="button" variant="outline" icon={ArrowLeft} onClick={() => navigate('/projects')}>Back</Button>
            <Button type="submit" icon={Save} loading={saving}>Save Project</Button>
          </>
        }
      />
 
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="space-y-5">
              <FormField label="Title" error={errors.title?.message} required>
                <Input placeholder="Colonial Revival Re-roof" {...register('title')} error={!!errors.title} />
              </FormField>
              <FormField label="Description" error={errors.description?.message} required>
                <Textarea rows={5} placeholder="Describe the scope of work..." {...register('description')} error={!!errors.description} />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="City"><Input {...register('city')} /></FormField>
                <FormField label="State"><Input {...register('state')} /></FormField>
              </div>
              <FormField label="Completion Date"><Input type="date" {...register('completionDate')} /></FormField>
            </CardContent>
          </Card>
 
          <Card>
            <CardHeader><CardTitle>Customer Review</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <FormField label="Customer Name"><Input {...register('customerName')} /></FormField>
              <FormField label="Rating">
                <Select {...register('customerRating')}>
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
                </Select>
              </FormField>
              <FormField label="Review Text"><Textarea rows={3} {...register('customerReview')} /></FormField>
            </CardContent>
          </Card>
 
          <Card>
            <CardHeader><CardTitle>Before / After Gallery</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <MultiImageField label="Before Images" items={beforeItems} setItems={setBeforeItems} />
              <MultiImageField label="After Images" items={afterItems} setItems={setAfterItems} />
            </CardContent>
          </Card>
 
          <Card>
            <CardHeader><CardTitle>Additional Gallery</CardTitle></CardHeader>
            <CardContent>
              <MultiImageField label="Gallery Images" items={galleryItems} setItems={setGalleryItems} />
            </CardContent>
          </Card>
        </div>
 
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Publish</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <FormField label="Status">
                <Select {...register('status')}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </Select>
              </FormField>
              <FormField label="Category">
                <Select {...register('category')}>
                  <option value="">— No category —</option>
                  {(categoriesRes?.data || []).map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </Select>
              </FormField>
            </CardContent>
          </Card>
 
          <Card>
            <CardHeader><CardTitle>Cover Image</CardTitle></CardHeader>
            <CardContent>
              <ImageUpload
                value={coverPreview}
                onFilesSelected={([file]) => { setCoverFile(file); setCoverPreview(URL.createObjectURL(file)) }}
                onRemove={() => { setCoverFile(null); setCoverPreview(null) }}
              />
            </CardContent>
          </Card>
 
          <Card>
            <CardHeader><CardTitle>Services Used</CardTitle></CardHeader>
            <CardContent className="max-h-64 space-y-1 overflow-y-auto">
              {(servicesRes?.data || []).map((s) => (
                <label
                  key={s._id}
                  htmlFor={`service-${s._id}`}
                  className={cn('flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm', servicesUsed.includes(s._id) ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800')}
                >
                  <input
                    id={`service-${s._id}`}
                    name={`service-${s._id}`}
                    type="checkbox"
                    checked={servicesUsed.includes(s._id)}
                    onChange={() => toggleService(s._id)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-brand-500"
                  />
                  {s.title}
                </label>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
 