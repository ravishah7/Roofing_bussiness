import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Save, ExternalLink, FileCode2 } from 'lucide-react'
import { useSettingsQuery, useUpdateSettings } from './useSettings'
import PageHeader from '@/components/ui/PageHeader'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import FormField from '@/components/forms/FormField'
import Input from '@/components/forms/Input'
import Textarea from '@/components/forms/Textarea'
import Switch from '@/components/forms/Switch'
import { Controller } from 'react-hook-form'

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').replace(/\/api\/v1$/, '')

export default function SeoSettings() {
  const { data: settings, isLoading } = useSettingsQuery()
  const updateSettings = useUpdateSettings()

  const { register, handleSubmit, reset, control, watch } = useForm({ defaultValues: { seo: {} } })

  useEffect(() => {
    if (settings) reset({ seo: settings.seo || {} })
  }, [settings, reset])

  const onSubmit = (values) => {
    updateSettings.mutate({ seo: { ...values.seo, keywords: typeof values.seo.keywords === 'string' ? values.seo.keywords.split(',').map((k) => k.trim()).filter(Boolean) : values.seo.keywords } })
  }

  const metaTitle = watch('seo.metaTitle')
  const metaDescription = watch('seo.metaDescription')

  if (isLoading) return <div className="skeleton h-96 w-full rounded-2xl" />

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PageHeader title="SEO Settings" description="Global search and social metadata for your website." actions={<Button type="submit" icon={Save} loading={updateSettings.isPending}>Save Changes</Button>} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Global Meta</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <FormField label="Meta Title" hint={`${metaTitle?.length || 0}/70`}><Input {...register('seo.metaTitle')} /></FormField>
              <FormField label="Meta Description" hint={`${metaDescription?.length || 0}/160`}><Textarea rows={3} {...register('seo.metaDescription')} /></FormField>
              <FormField label="Keywords" hint="Comma-separated"><Input {...register('seo.keywords')} placeholder="roofing, roof repair, roof replacement" /></FormField>
              <FormField label="Canonical URL"><Input {...register('seo.canonicalUrl')} /></FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Open Graph</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <FormField label="OG Title"><Input {...register('seo.ogTitle')} /></FormField>
              <FormField label="OG Description"><Textarea rows={2} {...register('seo.ogDescription')} /></FormField>
              <FormField label="OG Image URL"><Input {...register('seo.ogImage')} /></FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Twitter Card</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <FormField label="Twitter Title"><Input {...register('seo.twitterTitle')} /></FormField>
              <FormField label="Twitter Description"><Textarea rows={2} {...register('seo.twitterDescription')} /></FormField>
              <FormField label="Twitter Image URL"><Input {...register('seo.twitterImage')} /></FormField>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Search preview</CardTitle></CardHeader>
            <CardContent>
              <div className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
                <p className="truncate text-sm text-brand-600 dark:text-brand-400">summitroofco.com</p>
                <p className="truncate text-base font-medium text-slate-800 dark:text-slate-100">{metaTitle || 'Your site title'}</p>
                <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{metaDescription || 'Your meta description will appear here.'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Robots &amp; Indexing</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <Controller name="seo.noIndex" control={control} render={({ field }) => (
                <Switch label="No-index this site" description="Hide from search engines (use for staging only)" checked={!!field.value} onChange={field.onChange} />
              )} />
              <Controller name="seo.noFollow" control={control} render={({ field }) => (
                <Switch label="No-follow links" checked={!!field.value} onChange={field.onChange} />
              )} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Generated Files</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <a href={`${API_ORIGIN}/robots.txt`} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3 text-sm text-slate-600 hover:border-brand-200 dark:border-slate-800 dark:text-slate-300">
                <span className="flex items-center gap-2"><FileCode2 className="h-4 w-4" /> robots.txt</span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </a>
              <a href={`${API_ORIGIN}/sitemap.xml`} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3 text-sm text-slate-600 hover:border-brand-200 dark:border-slate-800 dark:text-slate-300">
                <span className="flex items-center gap-2"><FileCode2 className="h-4 w-4" /> sitemap.xml</span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </a>
              <p className="pt-1 text-xs text-slate-400">Both are generated automatically from your published content — nothing to configure.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
