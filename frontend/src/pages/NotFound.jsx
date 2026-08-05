import { Link } from 'react-router-dom'
import { Home, TriangleAlert } from 'lucide-react'
import Seo from '@/components/Seo'
import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <>
      <Seo title="Page Not Found" description="The page you're looking for doesn't exist." path="/404" />
      <section className="flex min-h-[80vh] items-center bg-white dark:bg-ink-950">
        <Container className="text-center">
          <TriangleAlert className="mx-auto h-14 w-14 text-ember-500" />
          <h1 className="mt-6 font-display text-6xl font-semibold text-ink-900 dark:text-white">404</h1>
          <p className="mt-3 text-ink-600 dark:text-ink-400">This page has been torn off, just like an old shingle. Let's get you back on solid ground.</p>
          <Button as={Link} to="/" size="lg" icon={Home} iconPosition="left" className="mt-8">Back to Home</Button>
        </Container>
      </section>
    </>
  )
}
