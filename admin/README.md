# Summit Roof Co. — Admin Dashboard

A premium admin CMS for managing the Summit Roof Co. website, built with React 19, Vite, Tailwind CSS v4, React Query, React Hook Form + Zod, Recharts, and Framer Motion. Connects to the `roofing-backend` API.

## Getting Started

```bash
npm install
cp .env.example .env      # point VITE_API_URL at your running backend (default http://localhost:5000/api/v1)
npm run dev                # http://localhost:5174
```

Log in with the super_admin account created by `roofing-backend/scripts/seedAdmin.js`.

## What's included

**Layout & shell** — collapsible desktop sidebar (persisted), animated mobile drawer, sticky header with global search input, notifications dropdown (live "new" contact messages), profile dropdown, breadcrumbs, dark/light mode (persisted).

**Auth** — split-screen login, forgot/reset password, email verification landing page, JWT access token in memory + httpOnly refresh cookie with automatic silent refresh and request-queueing on 401, role-gated routes (`super_admin` / `admin` / `editor`).

**Dashboard Overview** — animated stat cards (published posts, projects, pending testimonials, new messages), a 30-day contact-submissions area chart (Recharts), quick actions, recent messages, recent blog activity.

**Full CRUD modules**, each wired to the real backend endpoints with React Query (loading skeletons, empty states, cache invalidation, toast notifications on every mutation):
- **Blog** — list with search/status filter/sort/bulk publish/bulk delete; create/edit form with a lightweight contentEditable rich-text editor, featured image upload, category/tags, SEO fields with live search-preview card, auto reading-time estimate, slug preview, unsaved-changes browser warning
- **Projects** — list + create/edit with cover image, gallery, before/after image sets, location, completion date, customer review, services-used multi-select
- **Services** — list with drag-to-reorder (persisted via `/services/reorder`) + create/edit with icon picker, pricing type, feature list, gallery
- **Testimonials** — approve/reject workflow, star rating, featured toggle, modal create/edit
- **FAQ** — drag-to-reorder accordion management, category, visibility toggle
- **Gallery** — album cards with cover + multi-image drag-and-drop upload
- **Media Library** — grid/list view toggle, folder filter, search, copy-URL, delete, paginated
- **Contact Messages** — inbox-style two-pane UI, status workflow, CSV export, mailto reply
- **Newsletter** — subscriber table, CSV export (streamed from the backend), delete
- **Website Settings** — tabbed (business info, hours, social links, analytics IDs, cookie banner, theme colors + logo/favicon upload)
- **SEO Settings** — global meta/OG/Twitter fields with a live search-preview, noindex/nofollow toggles, links to the generated `sitemap.xml` / `robots.txt`
- **Admin Users** — super-admin-only invite/role/active-toggle/delete
- **Profile & Change Password** — avatar upload, name edit, forced re-login after password change
- **Activity Log** — a derived recent-activity timeline (blogs + projects + contacts merged and sorted) — see note below

**Shared components** (`src/components/ui`, `src/components/forms`) — Button, Card, Badge/StatusBadge, Modal, Drawer, ConfirmDialog, Dropdown, DataTable (sort, row-select, bulk actions, column visibility, pagination, skeleton loading, empty state), Pagination, SearchBar, Tabs, StatCard, Skeleton, EmptyState, PageHeader, plus form primitives (Input, Textarea, Select, Switch, FormField, drag-and-drop ImageUpload, RichTextEditor).

## Honest gaps

- **Activity Log is derived, not a real audit trail.** The backend has no dedicated activity-log collection, so this page merges the existing "recent blogs / recent projects / recent contacts" dashboard endpoints into a timeline. It shows *what* was recently created, not a field-level "who changed what" history. Adding real audit logging would need a new backend model + middleware to write an entry on every mutation.
- **The rich-text editor is a lightweight contentEditable toolbar** (bold/italic/underline/headings/lists/quote/link), not a full TipTap/Slate integration. It produces real HTML and is genuinely usable, but doesn't have image-in-content embedding, tables, or collaborative editing.
- No automated tests.
- Session-expiration UX is handled (401 triggers silent refresh, then logout if that also fails) but there's no idle-timeout auto-logout timer — only reactive expiration handling.
