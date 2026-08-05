/**
 * Creates the first super_admin account from SUPER_ADMIN_* env vars.
 * Run once after deployment: `node scripts/seedAdmin.js`
 * Safe to re-run — it exits early if a super_admin already exists.
 */
import { env } from '../src/config/env.js'
import connectDB from '../src/config/db.js'
import Admin from '../src/models/Admin.model.js'
import mongoose from 'mongoose'

async function seed() {
  if (!env.SUPER_ADMIN_EMAIL || !env.SUPER_ADMIN_PASSWORD) {
    console.error('[seed] SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set in .env')
    process.exit(1)
  }

  await connectDB()

  const existing = await Admin.findOne({ role: 'super_admin' })
  if (existing) {
    console.log(`[seed] A super_admin already exists (${existing.email}). Skipping.`)
    await mongoose.disconnect()
    return
  }

  const admin = await Admin.create({
    name: env.SUPER_ADMIN_NAME,
    email: env.SUPER_ADMIN_EMAIL,
    password: env.SUPER_ADMIN_PASSWORD,
    role: 'super_admin',
    isActive: true,
    isEmailVerified: true,
  })

  console.log(`[seed] Super admin created: ${admin.email}`)
  console.log('[seed] Log in and change the password immediately.')
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('[seed] Failed:', err)
  process.exit(1)
})
