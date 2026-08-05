import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Send } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/api'
import { forgotPasswordSchema } from '@/lib/schemas'
import FormField from '@/components/forms/FormField'
import Input from '@/components/forms/Input'
import Button from '@/components/ui/Button'

export default function ForgotPassword() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) })

  const onSubmit = async ({ email }) => {
    try {
      await api.post('/auth/forgot-password', { email })
      setSent(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    }
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-100 text-success-500 dark:bg-success-500/15">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-xl font-semibold text-slate-900 dark:text-white">Check your inbox</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          If an account exists for that email, we've sent a link to reset your password.
        </p>
        <Link to="/login" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400">
          <ArrowLeft className="h-4 w-4" /> Back to login
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/login" className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600">
        <ArrowLeft className="h-4 w-4" /> Back to login
      </Link>
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Reset your password</h1>
      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
        Enter your email and we'll send you a link to reset it.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <FormField label="Email" error={errors.email?.message}>
          <Input type="email" placeholder="you@company.com" {...register('email')} error={!!errors.email} />
        </FormField>
        <Button type="submit" className="w-full justify-center" size="lg" loading={isSubmitting} icon={Send}>
          Send reset link
        </Button>
      </form>
    </div>
  )
}
