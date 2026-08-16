import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Save, FileText, Clock } from 'lucide-react'
import { useSettingsQuery, useUpdateLegalContent } from './useSettings'
import PageHeader from '@/components/ui/PageHeader'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import FormField from '@/components/forms/FormField'
import Textarea from '@/components/forms/Textarea'

function LegalDocumentCard({ title, updatedLabel, fieldName, register, placeholder }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
              <FileText className="h-4 w-4" />
            </span>
            {title}
          </CardTitle>
          {updatedLabel && (
            <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <Clock className="h-3 w-3" /> Updated {updatedLabel}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <FormField label="Content">
          <Textarea
            rows={20}
            className="text-sm leading-relaxed"
            placeholder={placeholder}
            {...register(fieldName)}
          />
        </FormField>
        <p className="mt-3 text-xs text-slate-400">Changes take effect immediately after saving.</p>
      </CardContent>
    </Card>
  )
}

export default function LegalSettings() {
  const { data: settings, isLoading } = useSettingsQuery()
  const updateSettings = useUpdateLegalContent()

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { privacyPolicy: '', termsOfService: '' },
  })

  useEffect(() => {
    if (settings) {
      reset({
        privacyPolicy: settings.legalContent?.privacyPolicy || '',
        termsOfService: settings.legalContent?.termsOfService || '',
      })
    }
  }, [settings, reset])

  const onSubmit = (values) => {
    updateSettings.mutate(values)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-10 w-64 rounded-lg" />
        <div className="skeleton h-96 w-full rounded-2xl" />
        <div className="skeleton h-96 w-full rounded-2xl" />
      </div>
    )
  }

  const privacyUpdated = settings?.legalContent?.privacyUpdatedAt
    ? new Date(settings.legalContent.privacyUpdatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null
  const termsUpdated = settings?.legalContent?.termsUpdatedAt
    ? new Date(settings.legalContent.termsUpdatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PageHeader
        title="Legal Content"
        description="Edit your Privacy Policy and Terms of Service."
        actions={
          <Button type="submit" icon={Save} loading={updateSettings.isPending}>
            Save Changes
          </Button>
        }
      />

      <div className="space-y-6">
        <LegalDocumentCard
          title="Privacy Policy"
          updatedLabel={privacyUpdated}
          fieldName="privacyPolicy"
          register={register}
          placeholder="Write your privacy policy content here..."
        />

        <LegalDocumentCard
          title="Terms of Service"
          updatedLabel={termsUpdated}
          fieldName="termsOfService"
          register={register}
          placeholder="Write your terms of service content here..."
        />
      </div>
    </form>
  )
}