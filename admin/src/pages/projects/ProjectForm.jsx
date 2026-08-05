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

function MultiImageField({ label, setFiles, previews, setPreviews }) {
  return (
    <FormField label={label}>
      <ImageUpload
        multiple
        value={previews}
        onFilesSelected={(newFiles) => {
          setFiles((f) => [...f, ...newFiles])
          setPreviews((p) => [...p, ...newFiles.map((f) => URL.createObjectURL(f))])
        }}
        onRemove={(i) => {
          setFiles((f) => f.filter((_, idx) => idx !== i))
          setPreviews((p) => p.filter((_, idx) => idx !== i))
        }}
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
  const [galleryFiles, setGalleryFiles] = useState([])
  const [galleryPreviews, setGalleryPreviews] = useState([])
  const [beforeFiles, setBeforeFiles] = useState([])
  const [beforePreviews, setBeforePreviews] = useState([])
  const [afterFiles, setAfterFiles] = useState([])
  const [afterPreviews, setAfterPreviews] = useState([])
  const [servicesUsed, setServicesUsed] = useState([])

  const { data: existing, isLoading } = useResourceItem('projects', isEdit ? id : null)
  const { data: servicesRes } = useResourceList('services', { limit: 100, status: 'published' })
  const createProject = useCreateResource('projects', { successMessage: 'Project created' })
  const updateProject = useUpdateResource('projects', { successMessage: 'Project updated' })

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: { title: '', description: '', city: '', state: '', completionDate: '', status: 'draft', customerName: '', customerRating: 5, customerReview: '' },
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
      })
      setCoverPreview(existing.coverImage?.url || null)
      setGalleryPreviews((existing.gallery || []).map((i) => i.url))
      setBeforePreviews((existing.beforeImages || []).map((i) => i.url))
      setAfterPreviews((existing.afterImages || []).map((i) => i.url))
      setServicesUsed((existing.servicesUsed || []).map((s) => s._id || s))
    }
  }, [existing, reset])

  const onSubmit = (values) => {
    const form = new FormData()
    form.append('title', values.title)
    form.append('description', values.description)
    form.append('status', values.status)
    if (values.city) form.append('location', JSON.stringify({ city: values.city, state: values.state }))
    if (values.completionDate) form.append('completionDate', values.completionDate)
    if (values.customerName) {
      form.append('customerReview', JSON.stringify({ name: values.customerName, rating: values.customerRating, text: values.customerReview }))
    }
    servicesUsed.forEach((s) => form.append('servicesUsed[]', s))

    if (coverFile) form.append('coverImage', coverFile)
    galleryFiles.forEach((f) => form.append('gallery', f))
    beforeFiles.forEach((f) => form.append('beforeImages', f))
    afterFiles.forEach((f) => form.append('afterImages', f))

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
              <MultiImageField label="Before Images" files={beforeFiles} setFiles={setBeforeFiles} previews={beforePreviews} setPreviews={setBeforePreviews} />
              <MultiImageField label="After Images" files={afterFiles} setFiles={setAfterFiles} previews={afterPreviews} setPreviews={setAfterPreviews} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Additional Gallery</CardTitle></CardHeader>
            <CardContent>
              <MultiImageField label="Gallery Images" files={galleryFiles} setFiles={setGalleryFiles} previews={galleryPreviews} setPreviews={setGalleryPreviews} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Publish</CardTitle></CardHeader>
            <CardContent>
              <FormField label="Status">
                <Select {...register('status')}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
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
                <label key={s._id} className={cn('flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm', servicesUsed.includes(s._id) ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800')}>
                  <input type="checkbox" checked={servicesUsed.includes(s._id)} onChange={() => toggleService(s._id)} className="h-3.5 w-3.5 rounded border-slate-300 text-brand-500" />
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
