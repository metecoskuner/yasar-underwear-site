// Shared product store using localStorage as the single source of truth.
// This file intentionally avoids hardcoded demo data. The app reads/writes
// products to localStorage under the key `yasar:products`.

export type Gender = 'male' | 'female' | 'unisex' | 'child';

export type Product = {
  id: string;
  title: string;
  productCode?: string;
  i18nTitle?: Record<string, string>;
  i18nDescription?: Record<string, string>;
  color?: string;
  image?: string;
  gender?: Gender;
  category?: string;
  images?: string[];
  price?: number | null;
  description?: string;
  sizes?: string[];
  stock?: number | null;
  createdAt?: string;
};

const STORAGE_KEY = 'yasar:products';

// Read products from localStorage. Safe to call on server — returns empty array.
export function getProducts(): Product[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Product[];
  } catch {
    return [];
  }
}

// Save products array to localStorage.
export function saveProducts(products: Product[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    try {
      // notify other windows/tabs and local listeners
      window.dispatchEvent(new CustomEvent('yasar:products:changed', { detail: { time: Date.now() } }))
    } catch {
      // ignore
    }
  } catch {
    // ignore
  }
}

// Helper to seed products programmatically (not used by default). Returns the saved array.
export function seedProducts(products: Product[]) {
  saveProducts(products);
  return getProducts();
}

export default {
  getProducts,
  saveProducts,
  seedProducts,
};
