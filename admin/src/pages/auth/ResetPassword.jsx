import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { KeyRound } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/api'
import { resetPasswordSchema } from '@/lib/schemas'
import FormField from '@/components/forms/FormField'
import Input from '@/components/forms/Input'
import Button from '@/components/ui/Button'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) })

  const onSubmit = async ({ password }) => {
    if (!token) return toast.error('Reset link is missing a token')
    try {
      await api.post('/auth/reset-password', { token, password })
      toast.success('Password reset — please sign in')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'This link is invalid or has expired')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Set a new password</h1>
      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">Choose a strong password you haven't used before.</p>

      {!token && (
        <p className="mt-4 rounded-lg bg-danger-100 px-4 py-3 text-sm text-danger-500 dark:bg-danger-500/15">
          This link is missing its reset token. Please request a new one.
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <FormField label="New password" error={errors.password?.message}>
          <Input type="password" placeholder="••••••••" {...register('password')} error={!!errors.password} />
        </FormField>
        <FormField label="Confirm password" error={errors.confirmPassword?.message}>
          <Input type="password" placeholder="••••••••" {...register('confirmPassword')} error={!!errors.confirmPassword} />
        </FormField>
        <Button type="submit" className="w-full justify-center" size="lg" loading={isSubmitting} icon={KeyRound} disabled={!token}>
          Reset password
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        <Link to="/login" className="font-medium text-brand-600 dark:text-brand-400">Back to login</Link>
      </p>
    </div>
  )
}
