import { Helmet } from 'react-helmet-async'

export default function Seo({ title, description, path = '/', image, structuredData }) {
  const fullTitle = `${title} | Summit Roof Co.`
  const url = `https://summitroofco.com${path}`

  const jsonLd = structuredData ?? {
    '@context': 'https://schema.org',
    '@type': 'RoofingContractor',
    name: 'Summit Roof Co.',
    telephone: '+1-800-555-1212',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '4820 Roofline Avenue, Suite 200',
      addressLocality: 'Chicago',
      addressRegion: 'IL',
      postalCode: '60601',
      addressCountry: 'US',
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
