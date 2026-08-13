import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Loader2 } from 'lucide-react'
 
function FullScreenLoader() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
    </div>
  )
}
 
export function ProtectedRoute({ roles }) {
  const { isAuthenticated, isChecking, admin } = useAuth()
  const location = useLocation()
 
  if (isChecking) return <FullScreenLoader />
 
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
 
  if (roles && !roles.includes(admin?.role)) {
    return <Navigate to="/" replace />
  }
 
  return <Outlet />
}
 
export function GuestRoute() {
  const { isAuthenticated, isChecking } = useAuth()
 
  if (isChecking) return <FullScreenLoader />
  if (isAuthenticated) return <Navigate to="/" replace />
 
  return <Outlet />
}
 