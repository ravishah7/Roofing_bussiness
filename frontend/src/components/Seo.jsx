import { Helmet } from 'react-helmet-async'
import { useSettings } from '@/hooks/useSettings'

export default function Seo({ title, description, path = '/', image, structuredData }) {
  const { settings } = useSettings()
  const { name, phone, address } = settings.business
  const fullTitle = `${title} | ${name}`
  const url = `https://summitroofco.com${path}`

  const jsonLd = structuredData ?? {
    '@context': 'https://schema.org',
    '@type': 'RoofingContractor',
    name,
    telephone: phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.zip,
      addressCountry: address.country || 'US',
    },
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content={image ? 'article' : 'website'} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  )
}
