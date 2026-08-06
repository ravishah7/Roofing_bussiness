import Seo from '@/components/Seo'
import Hero from '@/components/home/Hero'
import StatsCounter from '@/components/home/StatsCounter'
import TrustedBy from '@/components/home/TrustedBy'
import ServicesPreview from '@/components/home/ServicesPreview'
import BeforeAfterSlider from '@/components/home/BeforeAfterSlider'
import ProcessSteps from '@/components/home/ProcessSteps'
import ProjectsPreview from '@/components/home/ProjectsPreview'
import Testimonials from '@/components/home/Testimonials'
import FinancingBanner from '@/components/home/FinancingBanner'
import EmergencyBanner from '@/components/home/EmergencyBanner'
import FaqPreview from '@/components/home/FaqPreview'
import FinalCta from '@/components/home/FinalCta'
import { useSettings } from '@/hooks/useSettings'

export default function Home() {
  const { settings, isLoading, isError } = useSettings()

  if (isLoading) return null // or a loading spinner
  if (isError) return null // or an error component

  return (
    <>
      <Seo
        title={settings.seo?.metaTitle || 'Expert Roofing Services'}
        description={
          settings.seo?.metaDescription ||
          'Your existing description here'
        }
        path="/"
      />

      <Hero />
      <StatsCounter />
      <TrustedBy />
      <ServicesPreview />
      <BeforeAfterSlider />
      <ProcessSteps />
      <ProjectsPreview />
      <Testimonials />
      <FinancingBanner />
      <EmergencyBanner />
      <FaqPreview />
      <FinalCta />
    </>
  )
}