import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, KeyRound } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { changePasswordSchema } from '@/lib/schemas'
import PageHeader from '@/components/ui/PageHeader'
import Card, { CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import FormField from '@/components/forms/FormField'
import Input from '@/components/forms/Input'

export default function ChangePassword() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(changePasswordSchema) })

  const onSubmit = async ({ currentPassword, newPassword }) => {
    try {
      await api.patch('/auth/update-password', { currentPassword, newPassword })
      toast.success('Password updated — please sign in again')
      await logout()
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password')
    }
  }

  return (
    <div>
      <PageHeader title="Change Password" actions={<Button variant="outline" icon={ArrowLeft} onClick={() => navigate('/profile')}>Back</Button>} />
      <Card className="max-w-lg">
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormField label="Current Password" error={errors.currentPassword?.message}>
              <Input type="password" {...register('currentPassword')} error={!!errors.currentPassword} />
            </FormField>
            <FormField label="New Password" error={errors.newPassword?.message}>
              <Input type="password" {...register('newPassword')} error={!!errors.newPassword} />
            </FormField>
            <FormField label="Confirm New Password" error={errors.confirmPassword?.message}>
              <Input type="password" {...register('confirmPassword')} error={!!errors.confirmPassword} />
            </FormField>
            <Button type="submit" icon={KeyRound} loading={isSubmitting}>Update Password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
