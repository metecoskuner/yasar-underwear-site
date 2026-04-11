import { useEffect, useState } from 'react';
import type { Product } from '@/types/product';

const STORAGE_KEY = 'yasar:wishlist';

// Minimal product metadata we persist so UI can show title/image even when the
// canonical product list isn't available in-memory.
export type WishlistItem = {
  id: string;
  title?: string;
  image?: string;
  category?: string;
  productCode?: string;
  description?: string;
  i18nDescription?: Record<string, string> | undefined;
  i18nTitle?: Record<string, string> | undefined;
};

export default function useWishlist() {
  // Initialize from localStorage on the client so favorites persist across reloads
  const [favorites, setFavorites] = useState<WishlistItem[]>(() => {
    try {
      if (typeof window === 'undefined') return [];
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      const stored: WishlistItem[] = Array.isArray(parsed) ? parsed.map((p) => (typeof p === 'string' ? { id: p } : p)) : [];
      return stored;
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (err) {
      void err;
    }
  }, [favorites]);

  useEffect(() => {
    function onUpdated(e: Event) {
      try {
        const detail = (e as CustomEvent)?.detail as { favorites?: WishlistItem[] } | undefined;
        if (detail?.favorites) setFavorites(detail.favorites.map((p) => ({ ...p })));
        else {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            const stored: WishlistItem[] = Array.isArray(parsed) ? parsed.map((p) => (typeof p === 'string' ? { id: p } : p)) : [];
            setFavorites(stored);
          }
        }
      } catch (err) {
        void err;
      }
    }
    window.addEventListener('yasar:wishlist:updated', onUpdated as EventListener);
    return () => window.removeEventListener('yasar:wishlist:updated', onUpdated as EventListener);
  }, []);

  // Accept either an id or a product object. If product object provided we
  // persist minimal metadata so header can show image/title immediately.
  function toggle(input: string | Product | WishlistItem) {
    try {
      const id = typeof input === 'string' ? input : input.id;
      const asItem: WishlistItem = typeof input === 'string'
        ? { id }
        : {
          id: input.id,
          title: (input as Product).title,
          image: (input as Product).image ?? (input as Product).images?.[0],
          category: (input as Product).category,
          productCode: (input as Product).productCode,
          description: (input as Product).description,
          i18nTitle: (input as Product).i18nTitle,
          i18nDescription: (input as Product).i18nDescription,
        };

      if (typeof window === 'undefined') {
        setFavorites((prev) => (prev.some((p) => p.id === id) ? prev.filter((p) => p.id !== id) : [...prev, asItem]));
        return;
      }

      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const stored: WishlistItem[] = Array.isArray(parsed) ? parsed.map((p) => (typeof p === 'string' ? { id: p } : p)) : [];
      const exists = stored.some((p) => p.id === id);
      let next: WishlistItem[];
      if (exists) {
        next = stored.filter((p) => p.id !== id);
      } else {
        // if we have richer metadata prefer merging it
        next = [...stored, asItem];
      }

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (err) {
        void err;
      }

      setFavorites(next);
      try {
        window.dispatchEvent(new CustomEvent('yasar:wishlist:updated', { detail: { favorites: next } }));
        const added = !exists && next.some((p) => p.id === id);
        if (added) {
          try {
            if (process.env.NODE_ENV === 'development') console.log('[useWishlist] dispatching wishlist:open for', id);
            window.dispatchEvent(new CustomEvent('yasar:wishlist:open', { detail: { id } }));
          } catch (err) {
            void err;
          }
        }
        // Notify listeners about the change and include minimal metadata so
        // UI components can update even if they don't have the full product list.
        try {
          const detail = { id, title: asItem.title, added };
          window.dispatchEvent(new CustomEvent('yasar:wishlist:changed', { detail }));
        } catch (err) {
          void err;
        }
      } catch (err) {
        void err;
      }
      return;
    } catch (err) {
      void err;
    }
  }

  function isFavorite(id: string) {
    return favorites.some((p) => p.id === id);
  }

  function clear() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch (err) {
      void err;
    }
    setFavorites([]);
    try {
      window.dispatchEvent(new CustomEvent('yasar:wishlist:updated', { detail: { favorites: [] } }));
    } catch (err) {
      void err;
    }
  }

  function remove(id: string) {
    try {
      const next = favorites.filter((p) => p.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (err) { void err; }
      setFavorites(next);
      try { window.dispatchEvent(new CustomEvent('yasar:wishlist:updated', { detail: { favorites: next } })); } catch (err) { void err; }
    } catch (err) { void err; }
  }

  return { favorites, toggle, isFavorite, clear, remove } as const;
}
