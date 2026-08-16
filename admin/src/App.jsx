import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import AuthLayout from '@/components/layout/AuthLayout'
import AdminLayout from '@/components/layout/AdminLayout'
import { ProtectedRoute, GuestRoute } from '@/components/layout/ProtectedRoute'

const Login = lazy(() => import('@/pages/auth/Login'))
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword'))
const VerifyEmail = lazy(() => import('@/pages/auth/VerifyEmail'))

const Overview = lazy(() => import('@/pages/dashboard/Overview'))
const BlogList = lazy(() => import('@/pages/blog/BlogList'))
const BlogForm = lazy(() => import('@/pages/blog/BlogForm'))
const ProjectList = lazy(() => import('@/pages/projects/ProjectList'))
const ProjectForm = lazy(() => import('@/pages/projects/ProjectForm'))
const ServiceList = lazy(() => import('@/pages/services/ServiceList'))
const ServiceForm = lazy(() => import('@/pages/services/ServiceForm'))
const TestimonialList = lazy(() => import('@/pages/testimonials/TestimonialList'))
const FaqList = lazy(() => import('@/pages/faq/FaqList'))
const GalleryList = lazy(() => import('@/pages/gallery/GalleryList'))
const MediaLibrary = lazy(() => import('@/pages/media/MediaLibrary'))
const ContactInbox = lazy(() => import('@/pages/contact/ContactInbox'))
const NewsletterList = lazy(() => import('@/pages/newsletter/NewsletterList'))
const WebsiteSettings = lazy(() => import('@/pages/settings/WebsiteSettings'))
const SeoSettings = lazy(() => import('@/pages/settings/SeoSettings'))
const Profile = lazy(() => import('@/pages/profile/Profile'))
const ChangePassword = lazy(() => import('@/pages/profile/ChangePassword'))
const UserList = lazy(() => import('@/pages/users/UserList'))
const ActivityLog = lazy(() => import('@/pages/activity/ActivityLog'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const LegalSettings = lazy(() => import('@/pages/settings/LegalSettings'))

function PageLoader() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
      {/* Guest-only auth routes */}
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
      </Route>

      {/* Email verification works regardless of auth state */}
      <Route element={<AuthLayout />}>
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
      </Route>

      {/* Protected admin dashboard */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Overview />} />

          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/create" element={<BlogForm />} />
          <Route path="/blog/:id/edit" element={<BlogForm />} />

          <Route path="/projects" element={<ProjectList />} />
          <Route path="/projects/create" element={<ProjectForm />} />
          <Route path="/projects/:id/edit" element={<ProjectForm />} />

          <Route path="/services" element={<ServiceList />} />
          <Route path="/services/create" element={<ServiceForm />} />
          <Route path="/services/:id/edit" element={<ServiceForm />} />

          <Route path="/testimonials" element={<TestimonialList />} />
          <Route path="/faq" element={<FaqList />} />
          <Route path="/gallery" element={<GalleryList />} />
          <Route path="/media" element={<MediaLibrary />} />
          <Route path="/contact" element={<ContactInbox />} />
          <Route path="/newsletter" element={<NewsletterList />} />

          <Route path="/settings" element={<WebsiteSettings />} />
          <Route path="/settings/seo" element={<SeoSettings />} />
          <Route path="/settings/legal" element={<LegalSettings />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/password" element={<ChangePassword />} />

          <Route path="/activity" element={<ActivityLog />} />

          <Route element={<ProtectedRoute roles={['super_admin']} />}>
            <Route path="/users" element={<UserList />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
