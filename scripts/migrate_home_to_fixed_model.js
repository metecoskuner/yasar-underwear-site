/* eslint-disable @typescript-eslint/no-require-imports */
// Dry-run migration script: map existing data/admin-content.json home.sections
// into the fixed HomepageModel.
// Usage:
//  node scripts/migrate_home_to_fixed_model.js --dry-run
//  node scripts/migrate_home_to_fixed_model.js --apply --backup

const fs = require('fs')
const path = require('path')
const out = console.log

const DATA_FILE = path.join(process.cwd(), 'data', 'admin-content.json')

function safeRead(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')) } catch { return null }
}

function backup(file) {
  try {
    const now = new Date().toISOString().replace(/[:.]/g, '-')
    const dest = path.join(process.cwd(), 'backup', `admin-content.backup.${now}.json`)
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(file, dest)
    out('Backup created:', dest)
  } catch (e) { out('Backup failed:', e.message) }
}

function firstOfType(sections, type) {
  if (!Array.isArray(sections)) return null
  return sections.find(s => s.type === type) || null
}

function mapLocalized(obj) {
  // if obj is already localized object (map of locales) return it
  if (!obj) return {}
  if (typeof obj === 'string') return { tr: obj }
  if (typeof obj === 'object') return obj
  return {}
}

function generateModel(homePageRaw) {
  const pages = homePageRaw && homePageRaw.pages ? homePageRaw.pages : []
  const home = pages.find(p => p.slug === 'home')
  if (!home) return null

  const sections = home.sections || []
  const heroSec = firstOfType(sections, 'hero')
  const categoriesSec = firstOfType(sections, 'categories')
  const whyUsSec = firstOfType(sections, 'features') || firstOfType(sections, 'whyUs')
  const statsSec = firstOfType(sections, 'stats')
  const featuredSec = firstOfType(sections, 'featuredProducts') || firstOfType(sections, 'products')
  const countriesSec = firstOfType(sections, 'countries') || firstOfType(sections, 'world')
  const contactSec = firstOfType(sections, 'contactCta') || firstOfType(sections, 'contact')

  const model = { version: 1 }

  // hero (required)
  model.hero = {
    title: mapLocalized(heroSec?.content?.tr?.title || heroSec?.content?.en?.title || heroSec?.content?.title || ''),
    description: mapLocalized(heroSec?.content?.tr?.description || heroSec?.content?.en?.description || heroSec?.content?.description || ''),
    primaryCta: { label: mapLocalized(heroSec?.content?.tr?.cta || heroSec?.content?.en?.cta || heroSec?.content?.cta || 'Koleksiyonları Gör'), url: '/urunler' },
    backgroundImageUrl: ''
  }

  // categories
  model.categories = { items: [] }
  const catItems = categoriesSec && categoriesSec.content && (categoriesSec.content.tr?.items || categoriesSec.content.items || categoriesSec.items || [])
  ;(catItems || []).forEach(it => model.categories.items.push({ title: mapLocalized(it.title || it.label || ''), imageUrl: it.image || it.imageUrl || '', link: it.link || it.url || '' }))

  // whyUs
  model.whyUs = { intro: mapLocalized(whyUsSec?.content?.tr?.introText || whyUsSec?.content?.introText || ''), items: [] }
  const whyItems = whyUsSec && (whyUsSec.content?.tr?.items || whyUsSec.items || whyUsSec.content?.items || [])
  ;(whyItems || []).forEach(it => model.whyUs.items.push({ title: mapLocalized(it.title || ''), description: mapLocalized(it.description || it.summary || ''), icon: it.icon || '' }))

  // stats
  model.stats = { items: [] }
  const statItems = statsSec && (statsSec.content?.tr?.items || statsSec.items || statsSec.content?.items || [])
  ;(statItems || []).forEach(it => model.stats.items.push({ value: it.value || it.count || String(it.number || ''), label: mapLocalized(it.label || it.title || '') }))

  // featuredProducts
  model.featuredProducts = { productIds: [] }
  if (featuredSec) {
    const pids = featuredSec.content?.productIds || featuredSec.productIds || (featuredSec.items && featuredSec.items.map(x => x.id).filter(Boolean)) || []
    model.featuredProducts.productIds = pids
  }

  // countries
  model.countries = { items: [] }
  const countryItems = countriesSec && (countriesSec.content?.tr?.items || countriesSec.items || countriesSec.content?.items || [])
  ;(countryItems || []).forEach(it => model.countries.items.push({ code: it.code || it.countryCode || (it.label && (it.label.tr || it.label.en)) || '', label: mapLocalized(it.label || it.name || '') }))

  // contactCta
  model.contactCta = { title: mapLocalized(contactSec?.content?.tr?.title || contactSec?.content?.title || 'İletişime Geçin'), description: mapLocalized(contactSec?.content?.tr?.description || ''), responseTimeText: mapLocalized(contactSec?.content?.tr?.responseTimeText || ''), buttonLabel: mapLocalized(contactSec?.content?.tr?.buttonText || 'Bize Ulaşın'), buttonUrl: contactSec?.content?.tr?.buttonUrl || contactSec?.content?.buttonUrl || '/iletisim' }

  return model
}

async function main() {
  const args = process.argv.slice(2)
  const dry = args.includes('--dry-run') || args.includes('--dry') || !args.includes('--apply')
  const doBackup = args.includes('--backup')

  const raw = safeRead(DATA_FILE)
  if (!raw) { out('Could not read', DATA_FILE); process.exit(1) }

  const suggested = generateModel(raw)
  if (!suggested) { out('No home page found in admin-content.json'); process.exit(1) }

  out('--- Suggested HomepageModel (dry-run=', dry, ') ---')
  out(JSON.stringify(suggested, null, 2))

  if (!dry) {
    if (doBackup) backup(DATA_FILE)
    // write suggested into pages.home.sections as structured content
    const pages = raw.pages || []
    const home = pages.find(p => p.slug === 'home')
    if (!home) { out('home page not found'); process.exit(1) }
    home.sections = [
      { id: 'hero-1', type: 'hero', content: { tr: { title: suggested.hero.title.tr, description: suggested.hero.description.tr } , en: { title: suggested.hero.title.en || '', description: suggested.hero.description.en || '' } } },
      // categories
      { id: 'categories-1', type: 'categories', content: { tr: { items: (suggested.categories.items || []).map(i => ({ title: i.title.tr || '', image: i.imageUrl || '', link: i.link || '' })) } } },
      // whyUs
      { id: 'whyus-1', type: 'features', content: { tr: { introText: suggested.whyUs.intro?.tr || '', items: (suggested.whyUs.items || []).map(i => ({ title: i.title.tr || '', description: i.description.tr || '' })) } } },
      // stats
      { id: 'stats-1', type: 'stats', content: { tr: { items: (suggested.stats.items || []).map(i => ({ value: i.value, label: i.label.tr || '' })) } } },
      // featured
      { id: 'featured-1', type: 'featuredProducts', content: { productIds: suggested.featuredProducts.productIds || [] } },
      // countries
      { id: 'countries-1', type: 'countries', content: { tr: { items: (suggested.countries.items || []).map(c => ({ code: c.code || '', label: c.label.tr || '' })) } } },
      // contactCta
      { id: 'contact-cta-1', type: 'contactCta', content: { tr: { title: suggested.contactCta.title.tr || '', description: suggested.contactCta.description?.tr || '', responseTimeText: suggested.contactCta.responseTimeText?.tr || '', buttonText: suggested.contactCta.buttonLabel.tr || '', buttonUrl: suggested.contactCta.buttonUrl || '/iletisim' } } }
    ]

    fs.writeFileSync(DATA_FILE, JSON.stringify(raw, null, 2), 'utf8')
    out('Applied mapping and wrote to', DATA_FILE)
  } else {
    out('\nDry-run only. To apply changes run with --apply and optionally --backup')
  }
}

main()
  .catch(e => { console.error(e); process.exit(1) })
