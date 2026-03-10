export type LocalizedString = { [locale: string]: string }

export interface HeroSection {
  title: LocalizedString
  description: LocalizedString
  primaryCta: { label: LocalizedString; url: string }
  secondaryCta?: { label: LocalizedString; url: string }
  backgroundImageUrl?: string
}

export interface CategoryItem { title: LocalizedString; imageUrl?: string; link: string }
export interface CategoriesSection { items: CategoryItem[] }

export interface WhyUsItem { title: LocalizedString; description: LocalizedString; icon?: string }
export interface WhyUsSection { intro?: LocalizedString; items: WhyUsItem[] }

export interface StatItem { value: string; label: LocalizedString }
export interface StatsSection { items: StatItem[] }

export interface FeaturedProductsSection { productIds: string[] }

export interface CountryItem { code: string; label: LocalizedString }
export interface CountriesSection { items: CountryItem[] }

export interface ContactCtaSection {
  title: LocalizedString
  description?: LocalizedString
  responseTimeText?: LocalizedString
  buttonLabel: LocalizedString
  buttonUrl: string
}

export interface HomepageModel {
  version: number
  hero: HeroSection
  categories: CategoriesSection
  whyUs: WhyUsSection
  stats: StatsSection
  featuredProducts: FeaturedProductsSection
  countries: CountriesSection
  contactCta: ContactCtaSection
}
