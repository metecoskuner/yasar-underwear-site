import { useEffect, useState } from 'react';

const STORAGE_KEY = 'yasar:wishlist';

export default function useWishlist() {
  // Start empty so server/client markup matches during SSR. We'll hydrate
  // from localStorage on mount and merge with any in-memory changes to avoid
  // overwriting recent toggles.
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (err) {
      void err;
    }
  }, [favorites]);

  // Hydrate from localStorage on client mount and merge with current state so
  // we don't clobber any toggles that happened before hydration finished.
  useEffect(() => {
    let timer: number | undefined;
    try {
      if (typeof window === 'undefined') return;
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const stored: string[] = JSON.parse(raw);

      // merge stored + current favorites (preserve any user toggles that ran earlier)
      // Defer setState to avoid calling setState synchronously inside an effect
      timer = window.setTimeout(() => {
        setFavorites((prev) => {
          const merged = Array.from(new Set([...(prev || []), ...stored]));
          // Only update if different to avoid extra renders
          if (merged.length === (prev || []).length && merged.every((v, i) => (prev || [])[i] === v)) return prev as string[];
          try {
            // notify other listeners that we've hydrated from storage
            window.dispatchEvent(new CustomEvent('yasar:wishlist:updated', { detail: { favorites: merged } }));
          } catch (err) {
            void err;
          }
          return merged;
        });
      }, 0);
    } catch (err) {
      void err;
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  // Keep multiple hook instances in-sync within the same tab by emitting an event
  // whenever favorites change and listening for that event to update local state.
  useEffect(() => {
    function onUpdated(e: Event) {
      try {
        const detail = (e as CustomEvent)?.detail as { favorites?: string[] } | undefined;
        if (detail?.favorites) setFavorites(detail.favorites);
        else {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) setFavorites(JSON.parse(raw));
        }
      } catch (err) {
        void err;
      }
    }
    window.addEventListener('yasar:wishlist:updated', onUpdated as EventListener);
    return () => window.removeEventListener('yasar:wishlist:updated', onUpdated as EventListener);
  }, []);

  function toggle(id: string) {
    try {
      if (typeof window === 'undefined') {
        // Fallback to in-memory update for non-browser environments
        setFavorites((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
        return;
      }

      // Read persisted list directly so we base toggles on the source of truth
      const raw = localStorage.getItem(STORAGE_KEY);
      const stored: string[] = raw ? JSON.parse(raw) : [];
      const next = stored.includes(id) ? stored.filter((p) => p !== id) : [...stored, id];

      // persist synchronously so other code reading localStorage immediately sees the change
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (err) {
        void err;
      }

      // update local state and notify other hook instances
      setFavorites(next);
      try {
        window.dispatchEvent(new CustomEvent('yasar:wishlist:updated', { detail: { favorites: next } }));
        // if item was added (not removed), notify listeners to open the wishlist UI
        const added = !stored.includes(id) && next.includes(id);
        const removed = stored.includes(id) && !next.includes(id);
        if (added) {
          try {
              // debug: log when open event is dispatched (development only)
              if (process.env.NODE_ENV === 'development') console.log('[useWishlist] dispatching wishlist:open for', id);
              window.dispatchEvent(new CustomEvent('yasar:wishlist:open', { detail: { id } }));
            } catch (err) {
              void err;
            }
        }
        // if item was removed, notify listeners to close the wishlist UI
        if (removed) {
          try {
            if (process.env.NODE_ENV === 'development') console.log('[useWishlist] dispatching wishlist:close for', id);
            window.dispatchEvent(new CustomEvent('yasar:wishlist:close', { detail: { id } }));
          } catch (err) {
            void err;
          }
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
    return favorites.includes(id);
  }

  return { favorites, toggle, isFavorite } as const;
}
