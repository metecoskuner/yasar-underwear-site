import { HomepageModel } from '@/types/homepage'

function isLocalizedString(x: any): boolean {
  if (!x || typeof x !== 'object') return false
  return Object.keys(x).every(k => typeof x[k] === 'string')
}

function isUrl(s: any): boolean {
  if (typeof s !== 'string') return false
  return s.startsWith('/') || s.startsWith('http://') || s.startsWith('https://')
}

export function validateHomepage(model: any): { ok: boolean; errors: string[] } {
  const errors: string[] = []

  if (!model || typeof model !== 'object') {
    errors.push('Model must be an object')
    return { ok: false, errors }
  }

  if (typeof model.version !== 'number') errors.push('version must be a number')

  // hero
  if (!model.hero) {
    errors.push('hero is required')
  } else {
    const h = model.hero
    if (!isLocalizedString(h.title)) errors.push('hero.title must be a LocalizedString')
    if (!isLocalizedString(h.description)) errors.push('hero.description must be a LocalizedString')
    if (!h.primaryCta || !isLocalizedString(h.primaryCta.label) || !isUrl(h.primaryCta.url)) errors.push('hero.primaryCta must have label(LocalizedString) and url starting with / or http')
    if (h.secondaryCta) {
      if (!isLocalizedString(h.secondaryCta.label) || !isUrl(h.secondaryCta.url)) errors.push('hero.secondaryCta must have label(LocalizedString) and url starting with / or http')
    }
    if (h.backgroundImageUrl && typeof h.backgroundImageUrl !== 'string') errors.push('hero.backgroundImageUrl must be a string')
  }

  // categories
  if (!model.categories || !Array.isArray(model.categories.items)) {
    errors.push('categories.items must be an array')
  } else {
    if (model.categories.items.length > 8) errors.push('categories.items max 8')
    model.categories.items.forEach((it: any, i: number) => {
      if (!isLocalizedString(it.title)) errors.push(`categories.items[${i}].title must be LocalizedString`)
      if (it.imageUrl && typeof it.imageUrl !== 'string') errors.push(`categories.items[${i}].imageUrl must be string`)
      if (!isUrl(it.link)) errors.push(`categories.items[${i}].link must be a url starting with / or http`) 
    })
  }

  // whyUs
  if (!model.whyUs || !Array.isArray(model.whyUs.items)) errors.push('whyUs.items must be an array')
  else {
    if (model.whyUs.items.length > 6) errors.push('whyUs.items max 6')
    model.whyUs.items.forEach((it: any, i: number) => {
      if (!isLocalizedString(it.title)) errors.push(`whyUs.items[${i}].title must be LocalizedString`)
      if (!isLocalizedString(it.description)) errors.push(`whyUs.items[${i}].description must be LocalizedString`)
    })
  }

  // stats
  if (!model.stats || !Array.isArray(model.stats.items)) errors.push('stats.items must be an array')
  else {
    if (model.stats.items.length > 6) errors.push('stats.items max 6')
    model.stats.items.forEach((it: any, i: number) => {
      if (typeof it.value !== 'string') errors.push(`stats.items[${i}].value must be string`)
      if (!isLocalizedString(it.label)) errors.push(`stats.items[${i}].label must be LocalizedString`)
    })
  }

  // featuredProducts
  if (!model.featuredProducts || !Array.isArray(model.featuredProducts.productIds)) errors.push('featuredProducts.productIds must be an array')
  else if (model.featuredProducts.productIds.length > 8) errors.push('featuredProducts.productIds max 8')

  // countries
  if (!model.countries || !Array.isArray(model.countries.items)) errors.push('countries.items must be an array')
  else if (model.countries.items.length > 50) errors.push('countries.items max 50')
  else model.countries.items.forEach((it: any, i: number) => {
    if (typeof it.code !== 'string') errors.push(`countries.items[${i}].code must be string`) 
    if (!isLocalizedString(it.label)) errors.push(`countries.items[${i}].label must be LocalizedString`)
  })

  // contactCta
  if (!model.contactCta) errors.push('contactCta is required')
  else {
    if (!isLocalizedString(model.contactCta.title)) errors.push('contactCta.title must be LocalizedString')
    if (model.contactCta.description && !isLocalizedString(model.contactCta.description)) errors.push('contactCta.description must be LocalizedString')
    if (model.contactCta.responseTimeText && !isLocalizedString(model.contactCta.responseTimeText)) errors.push('contactCta.responseTimeText must be LocalizedString')
    if (!isLocalizedString(model.contactCta.buttonLabel)) errors.push('contactCta.buttonLabel must be LocalizedString')
    if (!isUrl(model.contactCta.buttonUrl)) errors.push('contactCta.buttonUrl must be a url starting with / or http')
  }

  return { ok: errors.length === 0, errors }
}
