import {
  Home as HomeIcon, Building2, Hammer, Wrench, ClipboardCheck, Siren,
  CloudLightning, FileCheck2, Layers, Grid3x3, Square, Settings2,
} from 'lucide-react'

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Projects', href: '/projects' },
  { label: 'Gallery', href: '/gallery' },
  // { label: 'Blogs', href: '/blog' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Service Areas', href: '/service-areas' },
  { label: 'Contact', href: '/contact' },
]

export const SERVICES = [
  { icon: HomeIcon, title: 'Residential Roofing', slug: 'residential-roofing', desc: 'Full-home roofing systems built for decades of protection and curb appeal.' },
  { icon: Building2, title: 'Commercial Roofing', slug: 'commercial-roofing', desc: 'Low-slope and flat roofing engineered for large-scale commercial properties.' },
  { icon: Hammer, title: 'Roof Replacement', slug: 'roof-replacement', desc: 'Complete tear-off and replacement with premium materials and craftsmanship.' },
  { icon: Wrench, title: 'Roof Repair', slug: 'roof-repair', desc: 'Fast, precise repairs for leaks, damage, and wear — done right the first time.' },
  { icon: ClipboardCheck, title: 'Roof Inspection', slug: 'roof-inspection', desc: 'Detailed 21-point inspections with photo documentation and a clear report.' },
  { icon: Siren, title: 'Emergency Roofing', slug: 'emergency-roofing', desc: '24/7 emergency response to stop damage the moment it happens.' },
  { icon: CloudLightning, title: 'Storm Damage', slug: 'storm-damage', desc: 'Rapid assessment and repair after hail, wind, and severe weather events.' },
  { icon: FileCheck2, title: 'Insurance Claims', slug: 'insurance-claims', desc: 'We manage documentation and work directly with your adjuster.' },
  { icon: Layers, title: 'Metal Roofing', slug: 'metal-roofing', desc: 'Standing-seam and metal shingle systems built for 50+ year lifespans.' },
  { icon: Grid3x3, title: 'Shingle Roofing', slug: 'shingle-roofing', desc: 'Architectural and designer asphalt shingles from top-tier manufacturers.' },
  { icon: Square, title: 'Flat Roofing', slug: 'flat-roofing', desc: 'TPO, EPDM, and modified bitumen systems for low-slope roofs.' },
  { icon: Settings2, title: 'Roof Maintenance', slug: 'roof-maintenance', desc: 'Scheduled maintenance plans that extend the life of your roof.' },
]

export const STATS = [
  { label: 'Roofs Completed', value: 4200, suffix: '+' },
  { label: 'Years in Business', value: 27, suffix: '' },
  { label: 'Average Rating', value: 4.9, suffix: '/5', decimals: 1 },
  { label: 'Licensed Crews', value: 38, suffix: '' },
]

export const TESTIMONIALS = [
  { name: 'Marianne Cole', location: 'Oak Park, IL', rating: 5, text: 'From the first inspection to the final walkthrough, the crew was precise, punctual, and left the property spotless. The roof looks incredible.' },
  { name: 'David Huang', location: 'Naperville, IL', rating: 5, text: 'They handled our entire insurance claim after the hailstorm. Zero stress on our end and the finished roof exceeded what we had before.' },
  { name: 'Priya Shah', location: 'Evanston, IL', rating: 5, text: 'Best contractor experience we have had on any home project. Clear pricing, daily updates, and a flawless standing-seam installation.' },
  { name: 'Robert Lange', location: 'Schaumburg, IL', rating: 5, text: 'Called them for an emergency leak at 11pm and had a crew tarping the roof within the hour. Professional from start to finish.' },
]

export const FAQS = [
  { q: 'How long does a full roof replacement take?', a: 'Most residential replacements are completed in 1–3 days depending on roof size, pitch, and material. Commercial projects are scoped individually and scheduled around your operations.' },
  { q: 'Do you work directly with insurance companies?', a: 'Yes. We document all storm and impact damage, meet adjusters on-site, and manage the claims paperwork so you are not navigating it alone.' },
  { q: 'What roofing materials do you install?', a: 'Architectural asphalt shingles, standing-seam and metal shingle systems, TPO and EPDM flat roofing, and slate and tile on request.' },
  { q: 'Is a free inspection really free?', a: 'Yes — every inspection includes a full report with photos and a written estimate, with no obligation to move forward.' },
  { q: 'What warranty comes with a new roof?', a: 'Every installation includes a manufacturer material warranty plus our own workmanship warranty, with terms detailed in your proposal.' },
  { q: 'Do you offer financing?', a: 'Yes, we offer flexible financing plans with approval decisions typically available same-day. See our Financing page for current options.' },
]

export const SERVICE_AREAS = [
  'Oak Park', 'Naperville', 'Evanston', 'Schaumburg', 'Arlington Heights',
  'Skokie', 'Wilmette', 'Elmhurst', 'Downers Grove', 'Glenview',
  'Park Ridge', 'Hinsdale',
]

export const PROJECTS = [
  { title: 'Colonial Revival Re-roof', category: 'Residential', location: 'Oak Park, IL', date: 'May 2026', img: '/images/roof-install-project.jpg' },
  { title: 'Distribution Center Flat Roof', category: 'Commercial', location: 'Elk Grove Village, IL', date: 'March 2026', img: 'https://images.unsplash.com/photo-1622021142947-da7dedc7c39a?q=80&w=1200&auto=format&fit=crop' },
  { title: 'Standing Seam Metal Install', category: 'Metal', location: 'Wilmette, IL', date: 'February 2026', img: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1200&auto=format&fit=crop' },
  { title: 'Storm Damage Restoration', category: 'Insurance', location: 'Schaumburg, IL', date: 'January 2026', img: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop' },
  { title: 'Modern Farmhouse Roofing', category: 'Residential', location: 'Hinsdale, IL', date: 'December 2025', img: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=1200&auto=format&fit=crop' },
  { title: 'Retail Plaza TPO Re-roof', category: 'Commercial', location: 'Naperville, IL', date: 'November 2025', img: 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&w=1200&auto=format&fit=crop' },
]

export const BLOG_POSTS = [
  { title: '7 Warning Signs Your Roof Needs Replacing', category: 'Maintenance', readMins: 6, date: 'Jul 2, 2026', excerpt: 'Curling shingles, granule loss, and daylight in the attic are early signals — here is what to watch for before a small issue becomes a major repair.' },
  { title: 'What Insurance Actually Covers After a Hailstorm', category: 'Insurance', readMins: 8, date: 'Jun 18, 2026', excerpt: 'A practical breakdown of how adjusters evaluate hail damage, and how to make sure your claim reflects the real scope of work.' },
  { title: 'Metal vs. Architectural Shingles: A Real Cost Comparison', category: 'Materials', readMins: 7, date: 'Jun 4, 2026', excerpt: 'Upfront cost is only part of the story. Here is how lifespan, maintenance, and resale value compare over a 30-year horizon.' },
  { title: 'Preparing Your Roof for Storm Season', category: 'Maintenance', readMins: 5, date: 'May 20, 2026', excerpt: 'A pre-season checklist that catches the small vulnerabilities most likely to turn into emergency calls.' },
]
