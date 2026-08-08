
import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import { env } from '../src/config/env.js'
import connectDB from '../src/config/db.js'
import Category from '../src/models/Category.model.js'

const CATEGORIES = [
  // Project categories
  { name: 'Residential',           type: 'project', description: 'Single-family and multi-family home roofing projects' },
  { name: 'Commercial',            type: 'project', description: 'Commercial and industrial roofing projects' },
  { name: 'Insurance Restoration', type: 'project', description: 'Storm damage and insurance claim restorations' },
  { name: 'New Construction',      type: 'project', description: 'New build roofing installations' },
  { name: 'Repair',                type: 'project', description: 'Roof repair and maintenance work' },

  // Gallery categories
  { name: 'Before & After',        type: 'gallery', description: 'Side-by-side transformation photos' },
  { name: 'Residential',           type: 'gallery', description: 'Residential roofing photo gallery' },
  { name: 'Commercial',            type: 'gallery', description: 'Commercial roofing photo gallery' },
  { name: 'Process',               type: 'gallery', description: 'Behind-the-scenes installation photos' },

  // Blog categories
  { name: 'Maintenance Tips',      type: 'blog', description: 'How to care for and extend the life of your roof' },
  { name: 'Insurance & Claims',    type: 'blog', description: 'Navigating storm damage claims and insurance' },
  { name: 'Materials Guide',       type: 'blog', description: 'Shingles, metal, tile — which is right for you?' },
  { name: 'Company News',          type: 'blog', description: 'Updates from the Summit Roof Co. team' },
]

async function seed() {
  await connectDB()
  let created = 0, skipped = 0
  for (const cat of CATEGORIES) {
    const exists = await Category.findOne({ name: cat.name, type: cat.type })
    if (exists) { console.log(`[skip] ${cat.type} / "${cat.name}"`); skipped++; continue }
    await Category.create(cat)
    console.log(`[created] ${cat.type} / "${cat.name}"`)
    created++
  }
  console.log(`\nDone — ${created} created, ${skipped} skipped.`)
  await mongoose.disconnect()
}

seed().catch((err) => { console.error(err); process.exit(1) })