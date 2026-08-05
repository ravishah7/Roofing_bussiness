import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Save } from 'lucide-react'
import { useSettingsQuery, useUpdateSettings, useUploadBrand } from './useSettings'
import PageHeader from '@/components/ui/PageHeader'
import Card, { CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Tabs from '@/components/ui/Tabs'
import FormField from '@/components/forms/FormField'
import Input from '@/components/forms/Input'
import Textarea from '@/components/forms/Textarea'
import ImageUpload from '@/components/forms/ImageUpload'

const TABS = [
  { value: 'business', label: 'Business Info' },
  { value: 'hours', label: 'Business Hours' },
  { value: 'social', label: 'Social & Links' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'cookie', label: 'Cookie Banner' },
  { value: 'theme', label: 'Theme & Branding' },
]

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function WebsiteSettings() {
  const [tab, setTab] = useState('business')
  const { data: settings, isLoading } = useSettingsQuery()
  const updateSettings = useUpdateSettings()
  const uploadLogo = useUploadBrand('logo')
  const uploadFavicon = useUploadBrand('favicon')

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: { business: {}, social: {}, analytics: {}, cookieBanner: {}, theme: {} },
  })

  useEffect(() => {
    if (settings) {
      reset({
        business: {
          ...settings.business,
          openingHours: settings.business?.openingHours?.length
            ? settings.business.openingHours
            : DAYS.map((day) => ({ day, open: '08:00', close: '18:00', isClosed: false })),
        },
        social: settings.social || {},
        analytics: settings.analytics || {},
        cookieBanner: settings.cookieBanner || {},
        theme: settings.theme || {},
      })
    }
  }, [settings, reset])

  const openingHours = watch('business.openingHours') || []

  const onSubmit = (values) => {
    if (tab === 'business') updateSettings.mutate({ business: values.business })
    else if (tab === 'social') updateSettings.mutate({ social: values.social })
    else if (tab === 'analytics') updateSettings.mutate({ analytics: values.analytics })
    else if (tab === 'cookie') updateSettings.mutate({ cookieBanner: values.cookieBanner })
    else if (tab === 'theme') updateSettings.mutate({ theme: values.theme })
    else if (tab === 'hours') updateSettings.mutate({ business: { openingHours: values.business.openingHours } })
  }

  if (isLoading) return <div className="skeleton h-96 w-full rounded-2xl" />

  return (
    <div>
      <PageHeader title="Website Settings" description="Business details shown across your public site." actions={<Button icon={Save} loading={updateSettings.isPending} onClick={handleSubmit(onSubmit)}>Save Changes</Button>} />

      <Card>
        <div className="border-b border-slate-100 p-2 dark:border-slate-800">
          <Tabs tabs={TABS} active={tab} onChange={setTab} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {tab === 'business' && (
            <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="Business Name"><Input {...register('business.name')} /></FormField>
              <FormField label="Tagline"><Input {...register('business.tagline')} /></FormField>
              <FormField label="Phone"><Input {...register('business.phone')} /></FormField>
              <FormField label="Emergency Phone"><Input {...register('business.emergencyPhone')} /></FormField>
              <FormField label="Email"><Input type="email" {...register('business.email')} /></FormField>
              <FormField label="License Number"><Input {...register('business.licenseNumber')} /></FormField>
              <FormField label="WhatsApp Number"><Input {...register('business.whatsappNumber')} /></FormField>
              <FormField label="Calendly URL"><Input {...register('business.calendlyUrl')} /></FormField>
              <FormField label="Google Maps URL" className="sm:col-span-2"><Input {...register('business.googleMapsUrl')} /></FormField>
              <FormField label="Street Address"><Input {...register('business.address.street')} /></FormField>
              <FormField label="City"><Input {...register('business.address.city')} /></FormField>
              <FormField label="State"><Input {...register('business.address.state')} /></FormField>
              <FormField label="ZIP Code"><Input {...register('business.address.zip')} /></FormField>
            </CardContent>
          )}

          {tab === 'hours' && (
            <CardContent className="space-y-3">
              {openingHours.map((_, i) => (
                <div key={i} className="grid grid-cols-4 items-center gap-3">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{DAYS[i]}</span>
                  <Input type="time" {...register(`business.openingHours.${i}.open`)} />
                  <Input type="time" {...register(`business.openingHours.${i}.close`)} />
                  <label className="flex items-center gap-2 text-xs text-slate-500">
                    <input type="checkbox" {...register(`business.openingHours.${i}.isClosed`)} className="h-3.5 w-3.5 rounded border-slate-300" /> Closed
                  </label>
                </div>
              ))}
            </CardContent>
          )}

          {tab === 'social' && (
            <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {['facebook', 'instagram', 'youtube', 'twitter', 'linkedin', 'tiktok'].map((key) => (
                <FormField key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
                  <Input placeholder={`https://${key}.com/...`} {...register(`social.${key}`)} />
                </FormField>
              ))}
            </CardContent>
          )}

          {tab === 'analytics' && (
            <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField label="Google Analytics ID" hint="G-XXXXXXXXXX"><Input {...register('analytics.googleAnalyticsId')} /></FormField>
              <FormField label="Google Tag Manager ID" hint="GTM-XXXXXXX"><Input {...register('analytics.googleTagManagerId')} /></FormField>
              <FormField label="Facebook Pixel ID"><Input {...register('analytics.facebookPixelId')} /></FormField>
              <FormField label="Google Site Verification"><Input {...register('analytics.googleSiteVerification')} /></FormField>
              <FormField label="Google Place ID" hint="Used for Google Reviews integration" className="sm:col-span-2"><Input {...register('analytics.googlePlaceId')} /></FormField>
            </CardContent>
          )}

          {tab === 'cookie' && (
            <CardContent className="space-y-5">
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Show cookie banner</span>
                <input type="checkbox" {...register('cookieBanner.isEnabled')} className="h-5 w-5 rounded border-slate-300 text-brand-500" />
              </label>
              <FormField label="Banner Message"><Textarea rows={2} {...register('cookieBanner.message')} /></FormField>
              <FormField label="Policy Link"><Input {...register('cookieBanner.policyUrl')} /></FormField>
            </CardContent>
          )}

          {tab === 'theme' && (
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {['primaryColor', 'secondaryColor', 'accentColor'].map((key) => (
                  <FormField key={key} label={key.replace('Color', ' Color')}>
                    <div className="flex items-center gap-2">
                      <input type="color" {...register(`theme.${key}`)} className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-slate-200 dark:border-slate-700" />
                      <Input {...register(`theme.${key}`)} />
                    </div>
                  </FormField>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField label="Logo">
                  <ImageUpload value={settings?.logo?.url} onFilesSelected={([f]) => uploadLogo.mutate(f)} hint="PNG or SVG recommended" />
                </FormField>
                <FormField label="Favicon">
                  <ImageUpload value={settings?.favicon?.url} onFilesSelected={([f]) => uploadFavicon.mutate(f)} hint="Square PNG, at least 64×64" />
                </FormField>
              </div>
            </CardContent>
          )}
        </form>
      </Card>
    </div>
  )
}
