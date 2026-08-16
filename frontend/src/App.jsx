import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import PageLoader from '@/components/ui/PageLoader'

// Route-level code splitting — each page ships as its own chunk,
// fetched on demand instead of bundled into the initial payload.
const Home = lazy(() => import('@/pages/Home'))
const About = lazy(() => import('@/pages/About'))
const Services = lazy(() => import('@/pages/Services'))
const ServiceDetail = lazy(() => import('@/pages/ServiceDetail'))
const Projects = lazy(() => import('@/pages/Projects'))
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'))
const Gallery = lazy(() => import('@/pages/Gallery'))
const AlbumDetail = lazy(() => import('@/pages/AlbumDetail'))
const Blog = lazy(() => import('@/pages/Blog'))
const BlogPost = lazy(() => import('@/pages/BlogPost'))
const TestimonialsPage = lazy(() => import('@/pages/TestimonialsPage'))
const ServiceAreas = lazy(() => import('@/pages/ServiceAreas'))
const Financing = lazy(() => import('@/pages/Financing'))
const Emergency = lazy(() => import('@/pages/Emergency'))
const Faq = lazy(() => import('@/pages/Faq'))
const Contact = lazy(() => import('@/pages/Contact'))
const PrivacyPolicy = lazy(() => import('@/pages/Legal').then((m) => ({ default: m.PrivacyPolicy })))
const Terms = lazy(() => import('@/pages/Legal').then((m) => ({ default: m.Terms })))
const NotFound = lazy(() => import('@/pages/NotFound'))

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/:slug" element={<AlbumDetail />} />
          {/* <Route path="/blog" element={<Blog />} /> */}
          {/* <Route path="/blog/:slug" element={<BlogPost />} /> */}
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/service-areas" element={<ServiceAreas />} />
          <Route path="/financing" element={<Financing />} />
          <Route path="/emergency-roofing" element={<Emergency />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
