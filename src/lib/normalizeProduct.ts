// Utility to normalize product objects to prevent state corruption (language field, etc.)
// This normalizer is intentionally defensive: incoming product objects can have
// fields stored as JSON strings (from the DB) or nested/double-encoded values.
// We normalize images -> string[], i18nTitle -> {tr,en,fr,ar,ru}, title -> string,
// and language -> string. Keep it small and side-effect free.
export default function normalizeProduct(raw: Record<string, unknown>) {
  // Shallow copy to avoid mutating caller objects
  const p: Record<string, unknown> = { ...(raw || {}) };

  // Helper: try to parse JSON strings that may encode objects
  function tryParseMaybe(value: unknown): unknown {
    if (typeof value !== 'string') return value;
    const s = value.trim();
    if (!s) return '';
    if (s.startsWith('{') || s.startsWith('[') || s.startsWith('%7B')) {
      try {
        return JSON.parse(s);
      } catch {
        // fallthrough to return original string
      }
    }
    return value;
  }

  // Normalize images field -> always array of strings
  try {
    const rawImages = p.images;
    let imgs: string[] = [];
    if (Array.isArray(rawImages)) imgs = rawImages.filter((it): it is string => typeof it === 'string');
    else if (typeof rawImages === 'string') {
      try { imgs = JSON.parse(rawImages) as string[] } catch { imgs = [] }
    }
    p.images = imgs;
  } catch {
    p.images = [];
  }

  // Normalize title/i18nTitle: ensure i18nTitle is an object of simple strings
  try {
    const rawTitle = p.i18nTitle ?? p.title;
    let i18n: Record<string, string> | undefined;
    if (rawTitle && typeof rawTitle === 'object' && !Array.isArray(rawTitle)) {
      const rec = rawTitle as Record<string, unknown>;
      i18n = {} as Record<string, string>;
      for (const k of ['tr','en','fr','ar','ru']) {
        const v = rec[k];
        const maybe = tryParseMaybe(v);
        if (typeof maybe === 'string') {
          i18n[k] = maybe;
        } else if (maybe && typeof maybe === 'object' && 'tr' in (maybe as Record<string, unknown>) && typeof (maybe as Record<string, unknown>).tr === 'string') {
          i18n[k] = String((maybe as Record<string, unknown>).tr);
        } else {
          i18n[k] = '';
        }
      }
    } else if (typeof rawTitle === 'string') {
      const parsed = tryParseMaybe(rawTitle);
      if (parsed && typeof parsed === 'object') {
        const rec = parsed as Record<string, unknown>;
        i18n = {} as Record<string, string>;
        for (const k of ['tr','en','fr','ar','ru']) {
          const v = rec[k];
          const maybe = tryParseMaybe(v);
          if (typeof maybe === 'string') {
            i18n[k] = maybe;
          } else if (maybe && typeof maybe === 'object' && 'tr' in (maybe as Record<string, unknown>) && typeof (maybe as Record<string, unknown>).tr === 'string') {
            i18n[k] = String((maybe as Record<string, unknown>).tr);
          } else {
            i18n[k] = '';
          }
        }
      }
    }
    if (i18n) p.i18nTitle = i18n;
    // compute title fallback
    if (p.i18nTitle && typeof p.i18nTitle === 'object') {
      const it = p.i18nTitle as Record<string, string>;
      p.title = it.tr || it.en || Object.values(it).find((x) => !!x) || String(p.title ?? '');
    } else if (typeof p.title === 'string') {
      const maybe = tryParseMaybe(p.title as string);
      if (maybe && typeof maybe === 'object' && (maybe as Record<string, unknown>).tr) {
        const inner = maybe as Record<string, unknown>;
        p.title = String(inner.tr ?? inner.en ?? String(p.title));
      } else {
        p.title = String(p.title ?? '');
      }
    } else {
      p.title = String(p.title ?? '');
    }
  } catch {
    p.title = String(p.title ?? '');
  }

  // Normalize language -> always a string
  try {
    const langRaw = p.language;
    if (typeof langRaw === 'string') {
      p.language = langRaw;
    } else if (langRaw && typeof langRaw === 'object') {
      const lr = langRaw as Record<string, unknown>;
      p.language = String(lr.tr ?? lr.en ?? 'tr');
    } else {
      p.language = 'tr';
    }
  } catch {
    p.language = 'tr';
  }

  return p;
}
