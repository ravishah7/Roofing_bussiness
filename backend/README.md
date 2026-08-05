# Summit Roof Co. — CMS Backend

Production-architecture REST API for a roofing company CMS, built with Node.js, Express 5, MongoDB/Mongoose, JWT auth, and Cloudinary media storage.

## Getting Started

```bash
npm install
cp .env.example .env       # fill in Mongo URI, JWT secrets, Cloudinary keys, SMTP creds
npm run dev                # nodemon, http://localhost:5000
```

Then create your first admin account:

```bash
node scripts/seedAdmin.js
```

This reads `SUPER_ADMIN_NAME` / `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` from `.env` and creates a `super_admin`. **Change the password immediately after first login.**

All routes are versioned under `/api/v1`. Health check: `GET /health`.

## Architecture

```
src/
  config/       env, MongoDB connection, Cloudinary config
  models/       Mongoose schemas (11 models — see below)
  controllers/  request handlers, one file per resource
  routes/v1/    route definitions, mounted in routes/v1/index.js
  middleware/   auth, error handling, rate limiting, validation, uploads, sanitization
  services/     email (Nodemailer), Cloudinary upload, JWT token issuing
  utils/        ApiError, ApiResponse, asyncHandler, ApiFeatures (pagination/filter/sort/search), crudFactory
  validators/   express-validator chains per resource
scripts/
  seedAdmin.js  one-time super_admin creation
server.js       entry point — connects DB, starts Express, handles graceful shutdown
```

### Models
Admin, Category, Blog (with embedded comments), Project, Service, Testimonial, Faq, Album/Gallery, Contact, Newsletter, Media, Settings (singleton).

## Authentication

- Short-lived JWT **access token** (returned in the response body, sent as `Authorization: Bearer <token>`)
- Long-lived JWT **refresh token** (httpOnly cookie, scoped to `/api/v1/auth`, rotated on every refresh)
- Refresh token reuse is detected: if a used/rotated token is presented again, all sessions for that admin are revoked
- Roles: `super_admin` > `admin` > `editor`, enforced via `authorize(...)` middleware
- Email verification and forgot/reset password flows use single-use, hashed, time-limited tokens (SHA-256 of a random 32-byte value, never stored in plaintext)

| Endpoint | Method | Access |
|---|---|---|
| `/auth/register` | POST | `super_admin` only (creates other admins/editors) |
| `/auth/login` | POST | Public |
| `/auth/refresh` | POST | Public (reads refresh cookie) |
| `/auth/logout` | POST | Authenticated |
| `/auth/me` | GET | Authenticated |
| `/auth/verify-email/:token` | GET | Public |
| `/auth/forgot-password` | POST | Public |
| `/auth/reset-password` | POST | Public |
| `/auth/update-password` | PATCH | Authenticated |

## API conventions

- All list endpoints support `?page=&limit=&sort=&fields=&search=&<field>[gte]=...`
- Every response is `{ success, statusCode, message, data, meta? }`
- Errors are `{ success: false, statusCode, message, errors: [] }`
- Public GET endpoints (blogs, projects, services, gallery, testimonials, faqs) only return published/approved content unless the request carries a valid admin token — the same routes serve draft content to logged-in admins

## Resource endpoints (all under `/api/v1`)

`/blogs`, `/categories`, `/projects`, `/services`, `/testimonials`, `/faqs`, `/gallery`, `/contact`, `/newsletter`, `/media`, `/settings`, `/users`, `/dashboard/*`, plus `/sitemap.xml` and `/robots.txt` (also mirrored at the API root for reverse-proxy mapping).

Media-heavy resources (blog featured image, project cover/gallery/before/after, service cover/gallery, album images, user avatar, site logo/favicon) accept `multipart/form-data` and upload directly to Cloudinary via in-memory buffers — nothing touches local disk.

## Security

Helmet, locked-origin CORS, global + auth + contact-form rate limiting, bcrypt (cost 12), NoSQL-injection and XSS input sanitization (custom Express-5-safe wrappers — see `src/middleware/sanitize.middleware.js`), httpOnly/secure/sameSite refresh cookies, centralized error handler that normalizes Mongoose/JWT/Multer errors so internals never leak to clients.

## Known follow-ups before production launch

- Swap the CORS `allowedOrigins` and `.env` values for your real domains
- Point `MONGO_URI` at a provisioned Atlas (or self-hosted) cluster and run `seedAdmin.js` once
- Confirm Hostinger SMTP credentials and test the contact-form / verification / reset emails end-to-end
- Add automated tests (none are included — this ships the implementation, not a test suite)
- Consider adding response caching (e.g. Redis) in front of high-traffic public GETs (blogs, services) — the code is structured to make this a drop-in addition, not a rewrite
