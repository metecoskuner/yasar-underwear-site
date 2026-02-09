// Content model types for admin/editor

export type LanguageCode = string // e.g. 'en', 'tr', 'fr'

export interface LocalizedContent {
  title?: string
  description?: string
  images?: string[]
  video?: string
  [key: string]: unknown
}

export interface Section {
  id: string
  type: 'hero' | 'gallery' | 'text' | 'video' | string
  content: Record<LanguageCode, LocalizedContent>
}

export interface Page {
  id: string
  slug: string
  // optional page-level localized title
  title?: Record<LanguageCode, { title?: string } | string>
  sections: Section[]
}

export type ContentStore = {
  pages: Page[]
  [k: string]: unknown
}

// Example:
// const example: Page = {
//   id: 'home',
//   slug: 'home',
//   sections: [ { id: 'hero-1', type: 'hero', content: { en: { title: 'Welcome' } } } ]
// }
