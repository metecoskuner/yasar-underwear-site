/* eslint-disable @typescript-eslint/no-require-imports */
// One-time import script: data/admin-messages.json -> ContactMessage
//                       data/admin-offers.json   -> QuoteRequest
// Usage:
//   node scripts/import_legacy_to_db.js --dry-run
//   node scripts/import_legacy_to_db.js       (perform import)
// Options:
//   --backup      : create timestamped backups of the JSON files before importing
//   --dry-run     : perform no writes, only report what would be done
// Behavior:
//   - Attempts to map common legacy keys to Prisma model fields
//   - Skips entries that appear to already exist (by email+message+(createdAt))
//   - Logs summary and per-item actions

const fs = require('fs')
const path = require('path')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run') || args.includes('--dry')
const doBackup = args.includes('--backup')

const DATA_DIR = path.join(process.cwd(), 'data')
const MSG_FILE = path.join(DATA_DIR, 'admin-messages.json')
const OFFERS_FILE = path.join(DATA_DIR, 'admin-offers.json')

function safeReadJSON(file) {
  try {
    const raw = fs.readFileSync(file, 'utf8')
    return JSON.parse(raw)
  } catch (err) {
    console.warn('Could not read', file, err.message)
    return null
  }
}

function backupFile(file) {
  try {
    const now = new Date().toISOString().replace(/[:.]/g, '-')
    const destDir = path.join(process.cwd(), 'backup', 'import_' + now)
    fs.mkdirSync(destDir, { recursive: true })
    const base = path.basename(file)
    const dest = path.join(destDir, base)
    fs.copyFileSync(file, dest)
    console.log('Backed up', file, '->', dest)
  } catch (err) {
    console.warn('Backup failed for', file, err.message)
  }
}

function mapMessageItem(item) {
  if (!item) return null
  const name = item.name || item.from || item.sender || item.title || item.username || null
  const email = item.email || item.mail || item.contact || null
  const phone = item.phone || item.tel || item.mobile || item.phoneNumber || null
  const message = item.message || item.body || item.text || item.summary || null
  const createdAt = item.createdAt || item.date || item.time || item.timestamp || null
  return { name, email, phone, message, createdAt }
}

function mapOfferItem(item) {
  if (!item) return null
  const name = item.name || item.from || item.companyContact || item.contactName || null
  const email = item.email || item.mail || null
  const company = item.company || item.companyName || null
  const phone = item.phone || item.tel || null
  const product = item.product || item.title || item.item || null
  const qty = Number(item.qty || item.quantity || item.count || 1) || 1
  const message = item.message || item.body || item.summary || null
  const createdAt = item.createdAt || item.date || item.time || item.timestamp || null
  return { name, email, company, phone, product, qty, message, createdAt }
}

function parseDate(d) {
  if (!d) return null
  const maybe = new Date(d)
  if (!isNaN(maybe.getTime())) return maybe
  // try numeric timestamp
  const n = Number(d)
  if (!Number.isNaN(n)) return new Date(n)
  return null
}

async function existsContactLike({ email, message, createdAt }) {
  const where = {}
  if (email) where.email = email
  if (message) where.message = message
  // Try to find by email+message
  if (email && message) {
    const found = await prisma.contactMessage.findFirst({ where: { email, message } })
    if (found) return true
  }
  // If createdAt present, try to match within 1s window
  if (email && createdAt) {
    const start = new Date(createdAt.getTime() - 1000)
    const end = new Date(createdAt.getTime() + 1000)
    const found = await prisma.contactMessage.findFirst({ where: { email, createdAt: { gte: start, lte: end } } })
    if (found) return true
  }
  return false
}

async function existsQuoteLike({ email, message, createdAt }) {
  if (email && message) {
    const found = await prisma.quoteRequest.findFirst({ where: { email, message } })
    if (found) return true
  }
  if (email && createdAt) {
    const start = new Date(createdAt.getTime() - 1000)
    const end = new Date(createdAt.getTime() + 1000)
    const found = await prisma.quoteRequest.findFirst({ where: { email, createdAt: { gte: start, lte: end } } })
    if (found) return true
  }
  return false
}

async function importMessages(list) {
  let inserted = 0
  let skipped = 0
  for (const raw of list) {
    const m = mapMessageItem(raw)
    if (!m) { console.log('Skipping invalid item', raw); skipped++; continue }
    const { name = 'Anonymous', email = null, phone = null, message = '', createdAt } = m
    const parsed = parseDate(createdAt)
    try {
      const already = await existsContactLike({ email, message, createdAt: parsed })
      if (already) { console.log('Skipping duplicate message (email+message):', email, message && message.slice(0,80)); skipped++; continue }
      if (dryRun) { console.log('[dry-run] Would insert message:', { name, email, phone, message: message && message.slice(0,120), createdAt: parsed }); inserted++; continue }
      const data = { name, email: email || '', phone: phone || null, message: message || '', read: false }
      if (parsed) data.createdAt = parsed
      await prisma.contactMessage.create({ data })
      console.log('Inserted message:', email, (message && message.slice(0,60)) )
      inserted++
    } catch (err) {
      console.warn('Failed to insert message', err.message)
      skipped++
    }
  }
  return { inserted, skipped }
}

async function importOffers(list) {
  let inserted = 0
  let skipped = 0
  for (const raw of list) {
    const o = mapOfferItem(raw)
    if (!o) { console.log('Skipping invalid offer', raw); skipped++; continue }
    const { name = 'Unknown', email = null, company = null, phone = null, product = null, qty = 1, message = null, createdAt } = o
    const parsed = parseDate(createdAt)
    try {
      const already = await existsQuoteLike({ email, message, createdAt: parsed })
      if (already) { console.log('Skipping duplicate offer (email+message):', email, message && message.slice(0,80)); skipped++; continue }
      if (dryRun) { console.log('[dry-run] Would insert offer:', { name, email, company, product, qty, message: message && message.slice(0,120), createdAt: parsed }); inserted++; continue }
      const data = { name, email: email || '', company: company || null, phone: phone || null, product: product || null, qty: Number(qty) || 1, message: message || null, handled: false }
      if (parsed) data.createdAt = parsed
      await prisma.quoteRequest.create({ data })
      console.log('Inserted offer:', email, company, product, 'qty=', qty)
      inserted++
    } catch (err) {
      console.warn('Failed to insert offer', err.message)
      skipped++
    }
  }
  return { inserted, skipped }
}

async function main() {
  console.log('Import legacy data to DB — dryRun=', !!dryRun, 'backup=', !!doBackup)

  const msgsRaw = safeReadJSON(MSG_FILE)
  const offersRaw = safeReadJSON(OFFERS_FILE)

  const msgsList = msgsRaw && (Array.isArray(msgsRaw.messages) ? msgsRaw.messages : Array.isArray(msgsRaw) ? msgsRaw : [])
  const offersList = offersRaw && (Array.isArray(offersRaw.offers) ? offersRaw.offers : Array.isArray(offersRaw) ? offersRaw : [])

  console.log('Messages found:', msgsList.length, 'Offers found:', offersList.length)

  if (!msgsList.length && !offersList.length) {
    console.log('Nothing to import; exiting.')
    return
  }

  if (doBackup && !dryRun) {
    backupFile(MSG_FILE)
    backupFile(OFFERS_FILE)
  }

  const res = { messages: { inserted: 0, skipped: 0 }, offers: { inserted: 0, skipped: 0 } }

  if (msgsList.length) {
    const r = await importMessages(msgsList)
    res.messages = r
  }
  if (offersList.length) {
    const r = await importOffers(offersList)
    res.offers = r
  }

  console.log('Import summary:')
  console.log('  messages inserted=', res.messages.inserted, 'skipped=', res.messages.skipped)
  console.log('  offers   inserted=', res.offers.inserted, 'skipped=', res.offers.skipped)
}

main()
  .catch(e => {
    console.error('Import failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
