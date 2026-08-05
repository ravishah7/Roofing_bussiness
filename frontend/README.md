# Summit Roof Co. — Premium Roofing Website

A production-architecture React website for a roofing company, built with React 19, Vite, Tailwind CSS v4, Framer Motion, React Router, React Query, and Axios.

## Getting Started

```bash
npm install
npm run dev       # start local dev server
npm run build     # production build -> dist/
npm run preview   # preview the production build
```

## What's included

- **Pages**: Home, About, Services (+ dynamic service detail pages), Projects, Gallery, Blog (+ dynamic post pages), Testimonials, Service Areas, Financing, Emergency Roofing, FAQ, Contact, Privacy Policy, Terms, 404
- **Design system**: custom Tailwind theme (`src/index.css`) with the brief's orange/dark-gray/blue palette, Fraunces + Inter type pairing, and a signature "roofline" diagonal-cut section motif
- **Dark mode** with localStorage persistence (`src/context/ThemeContext.jsx`)
- **Animations**: Framer Motion scroll reveals, hero entrance sequence, hover micro-interactions, animated counters (React CountUp), testimonial carousel (Swiper)
- **Interactive features**: before/after drag slider, project filtering + lightbox, gallery lightbox, FAQ accordions, working contact form (React Hook Form)
- **SEO**: React Helmet Async on every page — title, meta description, canonical URL, Open Graph, Twitter cards, and JSON-LD `RoofingContractor` schema
- **Backend-ready API layer**: `src/lib/api.js` (Axios instance with auth interceptor) + `src/hooks/useContentQueries.js` (generic React Query CRUD hooks) — point `VITE_API_URL` at your backend to wire up blogs/projects/testimonials/gallery/FAQs/service-areas/messages/newsletter CRUD
- **Performance**: route-level code splitting (`React.lazy` + `Suspense`), lazy-loaded images, minimal initial bundle

## Content to customize before launch

All copy, stats, testimonials, services, projects, and blog posts live in `src/data/site.js` — edit that file to swap in your real business details, phone numbers, and content. Placeholder images are sourced from Unsplash; replace with your own project photography before going live. The hero background video and Google Maps embeds also use placeholder URLs.

## Notes on scope

This ships a fully working, deployable site with every page live and styled to the same premium standard as the homepage. A few things intentionally kept lightweight for a first pass, ready to extend:
- The admin CRUD screens themselves aren't built — the frontend integration layer (Axios + React Query hooks) is in place so you can connect them to a real backend/CMS
- Blog posts and service detail pages use shared template components rather than fully unique long-form content per entry
- Syntax highlighting, comments UI, and Calendly embed are not wired in (no real backend/service to connect them to yet)
