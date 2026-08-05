import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft, Home, Building2, Hammer, Wrench, ClipboardCheck, Siren, CloudLightning, FileCheck2, Layers, Grid3x3, Square, Settings2 } from 'lucide-react'
import { useResourceItem, useCreateResource, useUpdateResource } from '@/hooks/useResource'
import { serviceSchema } from '@/lib/schemas'
import { cn } from '@/lib/utils'
import PageHeader from '@/components/ui/PageHeader'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import FormField from '@/components/forms/FormField'
import Input from '@/components/forms/Input'
import Textarea from '@/components/forms/Textarea'
import Select from '@/components/forms/Select'
import ImageUpload from '@/components/forms/ImageUpload'

const ICONS = { Home, Building2, Hammer, Wrench, ClipboardCheck, Siren, CloudLightning, FileCheck2, Layers, Grid3x3, Square, Settings2 }

export default function ServiceForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [galleryFiles, setGalleryFiles] = useState([])
  const [galleryPreviews, setGalleryPreviews] = useState([])
  const [features, setFeatures] = useState([''])

  const { data: existing, isLoading } = useResourceItem('services', isEdit ? id : null)
  const createService = useCreateResource('services', { successMessage: 'Service created' })
  const updateService = useUpdateResource('services', { successMessage: 'Service updated' })

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: { title: '', shortDescription: '', description: '', icon: 'Home', pricingType: 'quote', minPrice: '', maxPrice: '', status: 'draft' },
  })

  useEffect(() => {
    if (existing) {
      reset({
        title: existing.title,
        shortDescription: existing.shortDescription || '',
        description: existing.description,
        icon: existing.icon || 'Home',
        pricingType: existing.pricing?.type || 'quote',
        minPrice: existing.pricing?.minPrice || '',
        maxPrice: existing.pricing?.maxPrice || '',
        status: existing.status,
      })
      setCoverPreview(existing.coverImage?.url || null)
      setGalleryPreviews((existing.gallery || []).map((i) => i.url))
      setFeatures(existing.features?.length ? existing.features : [''])
    }
  }, [existing, reset])

  const selectedIcon = watch('icon')
  const pricingType = watch('pricingType')

  const onSubmit = (values) => {
    const form = new FormData()
    form.append('title', values.title)
    form.append('shortDescription', values.shortDescription)
    form.append('description', values.description)
    form.append('icon', values.icon)
    form.append('status', values.status)
    form.append('pricing', JSON.stringify({ type: values.pricingType, minPrice: values.minPrice || undefined, maxPrice: values.maxPrice || undefined }))
    features.filter(Boolean).forEach((f) => form.append('features[]', f))
    if (coverFile) form.append('coverImage', coverFile)
    galleryFiles.forEach((f) => form.append('gallery', f))

    if (isEdit) updateService.mutate({ id, data: form }, { onSuccess: () => navigate('/services') })
    else createService.mutate(form, { onSuccess: () => navigate('/services') })
  }

  const saving = createService.isPending || updateService.isPending

  if (isEdit && isLoading) return <div className="skeleton h-96 w-full rounded-2xl" />

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PageHeader
        title={isEdit ? 'Edit Service' : 'New Service'}
        actions={
          <>
            <Button type="button" variant="outline" icon={ArrowLeft} onClick={() => navigate('/services')}>Back</Button>
            <Button type="submit" icon={Save} loading={saving}>Save Service</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="space-y-5">
              <FormField label="Title" error={errors.title?.message} required>
                <Input placeholder="Roof Inspection" {...register('title')} error={!!errors.title} />
              </FormField>
              <FormField label="Short Description" error={errors.shortDescription?.message} hint="Shown on service cards">
                <Textarea rows={2} {...register('shortDescription')} error={!!errors.shortDescription} />
              </FormField>
              <FormField label="Full Description" error={errors.description?.message} required>
                <Textarea rows={6} {...register('description')} error={!!errors.description} />
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Features</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {features.map((f, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={f}
                    placeholder="Free on-site inspection"
                    onChange={(e) => setFeatures((arr) => arr.map((v, idx) => (idx === i ? e.target.value : v)))}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={() => setFeatures((arr) => arr.filter((_, idx) => idx !== i))}>×</Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => setFeatures((arr) => [...arr, ''])}>Add feature</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Gallery</CardTitle></CardHeader>
            <CardContent>
              <ImageUpload
                multiple
                value={galleryPreviews}
                onFilesSelected={(files) => { setGalleryFiles((f) => [...f, ...files]); setGalleryPreviews((p) => [...p, ...files.map((f) => URL.createObjectURL(f))]) }}
                onRemove={(i) => { setGalleryFiles((f) => f.filter((_, idx) => idx !== i)); setGalleryPreviews((p) => p.filter((_, idx) => idx !== i)) }}
              />
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
            <CardHeader><CardTitle>Icon</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(ICONS).map(([name, Icon]) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setValue('icon', name)}
                    className={cn('flex h-12 items-center justify-center rounded-xl border-2', selectedIcon === name ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-500/10' : 'border-slate-100 text-slate-400 hover:border-slate-200 dark:border-slate-800')}
                    title={name}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Pricing</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <FormField label="Pricing Type">
                <Select {...register('pricingType')}>
                  <option value="quote">Quote on request</option>
                  <option value="fixed">Fixed price</option>
                  <option value="range">Price range</option>
                </Select>
              </FormField>
              {pricingType !== 'quote' && (
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Min ($)"><Input type="number" {...register('minPrice')} /></FormField>
                  {pricingType === 'range' && <FormField label="Max ($)"><Input type="number" {...register('maxPrice')} /></FormField>}
                </div>
              )}
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
        </div>
      </div>
    </form>
  )
}
