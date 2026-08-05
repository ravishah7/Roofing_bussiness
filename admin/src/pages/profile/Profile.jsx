import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { Save, KeyRound } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { profileSchema } from '@/lib/schemas'
import PageHeader from '@/components/ui/PageHeader'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import FormField from '@/components/forms/FormField'
import Input from '@/components/forms/Input'
import ImageUpload from '@/components/forms/ImageUpload'
import { initials, formatDate } from '@/lib/utils'

export default function Profile() {
  const { admin, refreshMe } = useAuth()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(profileSchema) })

  useEffect(() => {
    if (admin) reset({ name: admin.name })
  }, [admin, reset])

  const updateProfile = useMutation({
    mutationFn: async (values) => (await api.patch('/users/me', values)).data.data,
    onSuccess: async () => {
      await refreshMe()
      toast.success('Profile updated')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed'),
  })

  const uploadAvatar = useMutation({
    mutationFn: async (file) => {
      const form = new FormData()
      form.append('avatar', file)
      return (await api.patch('/users/me/avatar', form)).data.data
    },
    onSuccess: async () => {
      await refreshMe()
      toast.success('Avatar updated')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Upload failed'),
  })

  return (
    <div>
      <PageHeader title="My Profile" description="Manage your account details." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="h-fit">
          <CardContent className="flex flex-col items-center py-8 text-center">
            {admin?.avatar?.url ? (
              <img src={admin.avatar.url} alt="" className="h-20 w-20 rounded-full object-cover" />
            ) : (
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-500 text-2xl font-semibold text-white">{initials(admin?.name)}</span>
            )}
            <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{admin?.name}</h3>
            <p className="text-sm text-slate-500">{admin?.email}</p>
            <Badge tone="brand" className="mt-2 capitalize">{admin?.role?.replace('_', ' ')}</Badge>
            <p className="mt-3 text-xs text-slate-400">Joined {formatDate(admin?.createdAt)}</p>

            <div className="mt-6 w-full">
              <ImageUpload label="Update avatar" onFilesSelected={([f]) => uploadAvatar.mutate(f)} hint="Square image recommended" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Account Details</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit((v) => updateProfile.mutate(v))} className="space-y-5">
                <FormField label="Full Name" error={errors.name?.message}><Input {...register('name')} error={!!errors.name} /></FormField>
                <FormField label="Email"><Input value={admin?.email || ''} disabled /></FormField>
                <Button type="submit" icon={Save} loading={updateProfile.isPending || isSubmitting}>Save Changes</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Security</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</p>
                <p className="text-xs text-slate-400">Change your account password</p>
              </div>
              <Link to="/profile/password"><Button variant="outline" icon={KeyRound}>Change Password</Button></Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
