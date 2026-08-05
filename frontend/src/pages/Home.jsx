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

export default function Home() {
  return (
    <>
      <Seo
        title="Premium Residential & Commercial Roofing"
        description="Licensed roofing contractor with 27 years of experience. Free inspections, emergency repair, insurance claims, and financing available."
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
