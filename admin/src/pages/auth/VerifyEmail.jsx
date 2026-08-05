import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import api from '@/lib/api'

export default function VerifyEmail() {
  const { token } = useParams()
  const [state, setState] = useState('verifying') // verifying | success | error

  useEffect(() => {
    let cancelled = false
    api
      .get(`/auth/verify-email/${token}`)
      .then(() => !cancelled && setState('success'))
      .catch(() => !cancelled && setState('error'))
    return () => {
      cancelled = true
    }
  }, [token])

  return (
    <div className="text-center">
      {state === 'verifying' && (
        <>
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-500" />
          <p className="mt-4 text-sm text-slate-500">Verifying your email…</p>
        </>
      )}
      {state === 'success' && (
        <>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-100 text-success-500 dark:bg-success-500/15">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-xl font-semibold text-slate-900 dark:text-white">Email verified</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Your account is confirmed. You can sign in now.</p>
        </>
      )}
      {state === 'error' && (
        <>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-danger-100 text-danger-500 dark:bg-danger-500/15">
            <XCircle className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-xl font-semibold text-slate-900 dark:text-white">Link invalid or expired</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Please ask a super admin to resend your invite.</p>
        </>
      )}
      <Link to="/login" className="mt-6 inline-block text-sm font-medium text-brand-600 dark:text-brand-400">Back to login</Link>
    </div>
  )
}
