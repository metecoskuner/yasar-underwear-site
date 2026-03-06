function isLocalizedString(x: unknown): boolean {
  if (!x || typeof x !== 'object') return false
  const obj = x as Record<string, unknown>
  return Object.keys(obj).every(k => typeof obj[k] === 'string')
}

function isUrl(s: unknown): boolean {
  if (typeof s !== 'string') return false
  return s.startsWith('/') || s.startsWith('http://') || s.startsWith('https://')
}

export function validateHomepage(model: unknown): { ok: boolean; errors: string[] } {
  const errors: string[] = []

  if (!model || typeof model !== 'object') {
    errors.push('Model must be an object')
    return { ok: false, errors }
  }

  const m = model as Record<string, unknown>

  if (typeof m.version !== 'number') errors.push('version must be a number')

  // hero
  if (!m.hero) {
    errors.push('hero is required')
  } else {
    const h = m.hero as Record<string, unknown>
    if (!isLocalizedString(h.title)) errors.push('hero.title must be a LocalizedString')
    if (!isLocalizedString(h.description)) errors.push('hero.description must be a LocalizedString')
    if (!h.primaryCta || !isLocalizedString((h.primaryCta as Record<string, unknown>).label) || !isUrl((h.primaryCta as Record<string, unknown>).url)) errors.push('hero.primaryCta must have label(LocalizedString) and url starting with / or http')
    if (h.secondaryCta) {
      const sec = h.secondaryCta as Record<string, unknown>
      if (!isLocalizedString(sec.label) || !isUrl(sec.url)) errors.push('hero.secondaryCta must have label(LocalizedString) and url starting with / or http')
    }
    if (h.backgroundImageUrl && typeof h.backgroundImageUrl !== 'string') errors.push('hero.backgroundImageUrl must be a string')
  }

  // categories
  if (!m.categories || !Array.isArray((m.categories as Record<string, unknown>).items)) {
    errors.push('categories.items must be an array')
  } else {
    const cats = (m.categories as Record<string, unknown>).items as unknown[]
    if (cats.length > 8) errors.push('categories.items max 8')
    cats.forEach((it: unknown, i: number) => {
      const item = it as Record<string, unknown>
      if (!isLocalizedString(item.title)) errors.push(`categories.items[${i}].title must be LocalizedString`)
      if (item.imageUrl && typeof item.imageUrl !== 'string') errors.push(`categories.items[${i}].imageUrl must be string`)
      if (!isUrl(item.link)) errors.push(`categories.items[${i}].link must be a url starting with / or http`)
    })
  }

  // whyUs
  if (!m.whyUs || !Array.isArray((m.whyUs as Record<string, unknown>).items)) errors.push('whyUs.items must be an array')
  else {
    const why = (m.whyUs as Record<string, unknown>).items as unknown[]
    if (why.length > 6) errors.push('whyUs.items max 6')
    why.forEach((it: unknown, i: number) => {
      const item = it as Record<string, unknown>
      if (!isLocalizedString(item.title)) errors.push(`whyUs.items[${i}].title must be LocalizedString`)
      if (!isLocalizedString(item.description)) errors.push(`whyUs.items[${i}].description must be LocalizedString`)
    })
  }

  // stats
  if (!m.stats || !Array.isArray((m.stats as Record<string, unknown>).items)) errors.push('stats.items must be an array')
  else {
    const stats = (m.stats as Record<string, unknown>).items as unknown[]
    if (stats.length > 6) errors.push('stats.items max 6')
    stats.forEach((it: unknown, i: number) => {
      const item = it as Record<string, unknown>
      if (typeof item.value !== 'string') errors.push(`stats.items[${i}].value must be string`)
      if (!isLocalizedString(item.label)) errors.push(`stats.items[${i}].label must be LocalizedString`)
    })
  }

  // featuredProducts
  if (!m.featuredProducts || !Array.isArray((m.featuredProducts as Record<string, unknown>).productIds)) errors.push('featuredProducts.productIds must be an array')
  else {
    const fp = m.featuredProducts as Record<string, unknown>
    const ids = (fp.productIds as unknown[]) || []
    if (ids.length > 8) errors.push('featuredProducts.productIds max 8')
  }

  // countries
  if (!m.countries || !Array.isArray((m.countries as Record<string, unknown>).items)) errors.push('countries.items must be an array')
  else if (!Array.isArray((m.countries as Record<string, unknown>).items)) errors.push('countries.items must be an array')
  else {
    const countries = (m.countries as Record<string, unknown>).items as unknown[]
    if (countries.length > 50) errors.push('countries.items max 50')
    countries.forEach((it: unknown, i: number) => {
      const item = it as Record<string, unknown>
      if (typeof item.code !== 'string') errors.push(`countries.items[${i}].code must be string`)
      if (!isLocalizedString(item.label)) errors.push(`countries.items[${i}].label must be LocalizedString`)
    })
  }

  // contactCta
  if (!m.contactCta) errors.push('contactCta is required')
  else {
    const c = m.contactCta as Record<string, unknown>
    if (!isLocalizedString(c.title)) errors.push('contactCta.title must be LocalizedString')
    if (c.description && !isLocalizedString(c.description)) errors.push('contactCta.description must be LocalizedString')
    if (c.responseTimeText && !isLocalizedString(c.responseTimeText)) errors.push('contactCta.responseTimeText must be LocalizedString')
    if (!isLocalizedString(c.buttonLabel)) errors.push('contactCta.buttonLabel must be LocalizedString')
    if (!isUrl(c.buttonUrl)) errors.push('contactCta.buttonUrl must be a url starting with / or http')
  }

  return { ok: errors.length === 0, errors }
}
