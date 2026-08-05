import Blog from '../models/Blog.model.js'
import Project from '../models/Project.model.js'
import Service from '../models/Service.model.js'
import { env } from '../config/env.js'
import asyncHandler from '../utils/asyncHandler.js'

const STATIC_ROUTES = [
  '', 'about', 'services', 'projects', 'gallery', 'blog', 'testimonials',
  'service-areas', 'financing', 'emergency-roofing', 'faq', 'contact',
  'privacy-policy', 'terms',
]

function urlEntry(loc, lastmod, priority = '0.7') {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${priority}</priority>
  </url>`
}

/**
 * GET /sitemap.xml — dynamically generated from published content
 * plus the site's static routes.
 */
export const getSitemap = asyncHandler(async (req, res) => {
  const siteUrl = env.CLIENT_URL.replace(/\/$/, '')

  const [blogs, projects, services] = await Promise.all([
    Blog.find({ status: 'published' }).select('slug updatedAt').lean(),
    Project.find({ status: 'published' }).select('slug updatedAt').lean(),
    Service.find({ status: 'published' }).select('slug updatedAt').lean(),
  ])

  const entries = [
    ...STATIC_ROUTES.map((route) => urlEntry(`${siteUrl}/${route}`, new Date().toISOString(), route === '' ? '1.0' : '0.8')),
    ...blogs.map((b) => urlEntry(`${siteUrl}/blog/${b.slug}`, b.updatedAt.toISOString(), '0.6')),
    ...projects.map((p) => urlEntry(`${siteUrl}/projects/${p.slug}`, p.updatedAt.toISOString(), '0.6')),
    ...services.map((s) => urlEntry(`${siteUrl}/services/${s.slug}`, s.updatedAt.toISOString(), '0.7')),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`

  res.setHeader('Content-Type', 'application/xml')
  res.status(200).send(xml)
})

/**
 * GET /robots.txt
 */
export const getRobots = asyncHandler(async (req, res) => {
  const siteUrl = env.CLIENT_URL.replace(/\/$/, '')
  const body = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

Sitemap: ${siteUrl}/sitemap.xml`

  res.setHeader('Content-Type', 'text/plain')
  res.status(200).send(body)
})
