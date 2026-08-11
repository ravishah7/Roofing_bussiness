import { useEffect, useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, Send, Clock, ArrowLeft } from 'lucide-react'
import { useResourceItem, useCreateResource, useUpdateResource, useResourceList } from '@/hooks/useResource'
import { blogSchema } from '@/lib/schemas'
import { slugify } from '@/lib/utils'
import PageHeader from '@/components/ui/PageHeader'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import FormField from '@/components/forms/FormField'
import Input from '@/components/forms/Input'
import Textarea from '@/components/forms/Textarea'
import Select from '@/components/forms/Select'
import ImageUpload from '@/components/forms/ImageUpload'
import RichTextEditor from '@/components/forms/RichTextEditor'

function useUnsavedChangesWarning(isDirty) {
  useEffect(() => {
    const handler = (e) => {
      if (!isDirty) return
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])
}

export default function BlogForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(null)

  const { data: existing, isLoading } = useResourceItem('blogs', isEdit ? id : null)
  const { data: categoriesRes } = useResourceList('categories', { limit: 100, sort: 'name', type: 'blog' })
  const categories = categoriesRes?.data || []
  const createBlog = useCreateResource('blogs', { successMessage: 'Blog post created' })
  const updateBlog = useUpdateResource('blogs', { successMessage: 'Blog post updated' })

  const {
    register, handleSubmit, control, watch, reset, setValue,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '', excerpt: '', content: '', category: '',
      tags: '', status: 'draft', metaTitle: '', metaDescription: '',
    },
  })

  useUnsavedChangesWarning(isDirty)

  useEffect(() => {
    if (existing) {
      reset({
        title: existing.title,
        excerpt: existing.excerpt || '',
        content: existing.content,
        category: typeof existing.category === 'object'
          ? existing.category?._id || ''
          : existing.category || '',
        tags: (existing.tags || []).join(', '),
        status: existing.status,
        metaTitle: existing.seo?.metaTitle || '',
        metaDescription: existing.seo?.metaDescription || '',
      })
      setPreview(existing.featuredImage?.url || null)
    }
  }, [existing, reset])

  const title = watch('title')
  const content = watch('content')
  const metaTitle = watch('metaTitle')
  const metaDescription = watch('metaDescription')
  const slug = useMemo(() => slugify(title || ''), [title])
  const readingMinutes = useMemo(() => {
    const words = (content || '').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.round(words / 200))
  }, [content])

  const onSubmit = (values) => {
    const payload = {
      title: values.title,
      excerpt: values.excerpt,
      content: values.content,
      status: values.status,
      category: values.category || undefined,
      tags: values.tags ? values.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      readingTimeMinutes: readingMinutes,
      seo: { metaTitle: values.metaTitle, metaDescription: values.metaDescription },
    }

    let body = payload
    if (imageFile) {
      const form = new FormData()
      Object.entries(payload).forEach(([k, v]) => {
        if (v === undefined) return
        form.append(k, typeof v === 'object' ? JSON.stringify(v) : v)
      })
      form.append('featuredImage', imageFile)
      body = form
    }

    if (isEdit) {
      updateBlog.mutate({ id, data: body }, { onSuccess: () => navigate('/blog') })
    } else {
      createBlog.mutate(body, { onSuccess: () => navigate('/blog') })
    }
  }

  const saving = createBlog.isPending || updateBlog.isPending

  if (isEdit && isLoading) return <div className="skeleton h-96 w-full rounded-2xl" />

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PageHeader
        title={isEdit ? 'Edit Post' : 'New Post'}
        description={isEdit ? existing?.title : 'Draft a new article for your blog.'}
        actions={
          <>
            <Button type="button" variant="outline" icon={ArrowLeft} onClick={() => navigate('/blog')}>Back</Button>
            <Button type="submit" variant="secondary" icon={Save} loading={saving} onClick={() => setValue('status', 'draft')}>Save Draft</Button>
            <Button type="submit" icon={Send} loading={saving} onClick={() => setValue('status', 'published')}>Publish</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="space-y-5">
              <FormField label="Title" error={errors.title?.message} required>
                <Input placeholder="How to spot early roof damage" {...register('title')} error={!!errors.title} />
              </FormField>
              <p className="-mt-3 text-xs text-slate-400">
                Slug preview: <span className="font-mono text-slate-500 dark:text-slate-400">/blog/{slug || '...'}</span>
              </p>
              <FormField label="Excerpt" error={errors.excerpt?.message} hint="Shown in blog listing cards (max 300 characters)">
                <Textarea rows={2} placeholder="A short summary of the post..." {...register('excerpt')} error={!!errors.excerpt} />
              </FormField>
              <FormField label="Content" error={errors.content?.message} required>
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => <RichTextEditor value={field.value} onChange={field.onChange} error={!!errors.content} />}
                />
              </FormField>
              <p className="-mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="h-3.5 w-3.5" /> Estimated reading time: {readingMinutes} min
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>SEO</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <FormField label="Meta Title" hint={`${metaTitle?.length || 0}/70`}>
                <Input placeholder="Defaults to post title" {...register('metaTitle')} />
              </FormField>
              <FormField label="Meta Description" hint={`${metaDescription?.length || 0}/160`}>
                <Textarea rows={2} placeholder="Defaults to excerpt" {...register('metaDescription')} />
              </FormField>
              <div className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Search preview</p>
                <p className="truncate text-sm text-brand-600 dark:text-brand-400">summitroofco.com/blog/{slug || '...'}</p>
                <p className="truncate text-base font-medium text-slate-800 dark:text-slate-100">{metaTitle || title || 'Post title'}</p>
                <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{metaDescription || watch('excerpt') || 'Post description will appear here.'}</p>
              </div>
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
                  <option value="archived">Archived</option>
                </Select>
              </FormField>
              <FormField label="Category">
                <Select {...register('category')}>
                  <option value="">— No category —</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Tags" hint="Comma-separated">
                <Input placeholder="roofing, maintenance, tips" {...register('tags')} />
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Featured Image</CardTitle></CardHeader>
            <CardContent>
              <ImageUpload
                value={preview}
                onFilesSelected={([file]) => {
                  setImageFile(file)
                  setPreview(URL.createObjectURL(file))
                }}
                onRemove={() => {
                  setImageFile(null)
                  setPreview(null)
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
