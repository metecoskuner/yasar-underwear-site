export type Gender = 'male' | 'female' | 'unisex' | 'child'

export type Product = {
  id: string
  title: string
  isFeatured?: boolean
  productCode?: string
  i18nTitle?: Record<string, string>
  i18nDescription?: Record<string, string>
  color?: string
  image?: string
  gender?: Gender
  category?: string
  images?: string[]
  description?: string
  sizes?: string[]
  stock?: number | null
  createdAt?: string
}
