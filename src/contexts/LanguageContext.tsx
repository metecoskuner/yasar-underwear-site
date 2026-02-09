import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
// Load Turkish locale as a stable fallback so pages remain populated when a
// chosen language file is still loading or missing specific keys.
import trLocale from '../locales/tr.json';

type Lang = 'TR' | 'EN' | 'FR' | 'AR' | 'RU';

type Translations = Record<string, unknown>;

const locales: Record<Lang, () => Promise<Translations>> = {
  TR: () => import('../locales/tr.json').then(m => (m as unknown) as Translations),
  EN: () => import('../locales/en.json').then(m => (m as unknown) as Translations),
  FR: () => import('../locales/fr.json').then(m => (m as unknown) as Translations),
  AR: () => import('../locales/ar.json').then(m => (m as unknown) as Translations),
  RU: () => import('../locales/ru.json').then(m => (m as unknown) as Translations),
};

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  g: (key: string) => unknown;
};

const LangContext = createContext<LangContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Start with a deterministic value for SSR to avoid hydration mismatches.
  // Read persisted preference from localStorage only on the client after mount.
  const [lang, setLangState] = useState<Lang>('TR');
  const [dict, setDict] = useState<Translations | null>(null);
  const [overrides, setOverrides] = useState<Record<string, string> | null>(null);

  // On client mount, load persisted language preference from localStorage and apply it.
  // This runs only on the client and after the initial render so the server and
  // initial client markup remain consistent (no hydration errors).
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      // Normalize stored value to uppercase to tolerate values like 'en' saved by
      // various clients or older code paths. This keeps compatibility with the
      // Lang union ('TR'|'EN'|'FR'|'AR'|'RU').
      const storedRaw = window.localStorage.getItem('yasar_lang');
      const stored = storedRaw ? (storedRaw.toUpperCase() as Lang) : null;
      if (stored && Object.prototype.hasOwnProperty.call(locales, stored) && stored !== lang) {
        setLangState(stored);
      }
    } catch (e) {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    let mounted = true;
    locales[lang]().then((m) => {
      const mod = m as unknown;
      // Some bundlers expose JSON as { default: {...} }
      const payload = (mod && typeof mod === 'object' && 'default' in (mod as Record<string, unknown>))
        ? ((mod as Record<string, unknown>)['default'] as Translations)
        : (mod as Translations);
      if (mounted) setDict(payload);
    });
    // also fetch public admin content overrides (flat dot-keys)
    fetch('/api/content').then(r => r.json()).then((d) => {
      if (!mounted) return
      const c = d?.content || {}
      // ensure values are strings
      const flat: Record<string, string> = {}
      for (const k of Object.keys(c)) {
        const v = c[k]
        if (v === null || v === undefined) continue
        flat[k] = String(v)
      }

      // Convenience aliases: allow simple keys (heroTitle, heroSubtitle, contactCTA, footerText)
      const aliasMap: Record<string, string> = {
        heroTitle: 'components.hero.title',
        heroSubtitle: 'components.hero.subtitle',
        contactCTA: 'components.hero.ctaQuote',
        footerText: 'footer.copyright',
      }
      for (const [simple, full] of Object.entries(aliasMap)) {
        if (simple in c && !(full in flat)) {
          const v = c[simple]
          if (v !== null && v !== undefined) flat[full] = String(v)
        }
      }

      setOverrides(flat)
    }).catch(() => {})
    
    return () => { mounted = false; };
  }, [lang]);


  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      if (typeof window !== 'undefined') window.localStorage.setItem('yasar_lang', l);
    } catch (e) {
      // ignore write errors
    }
  };

  const t = useCallback((key: string) => {
    // Prefer the loaded dictionary translation when available. This prevents
    // admin-provided overrides (which may be unscoped or misconfigured) from
    // accidentally forcing a different language's text when a proper
    // translation exists in the locale files.
    if (dict) {
      const parts = key.split('.');
      let cur: unknown = dict;
      let found = true;
      for (const p of parts) {
        if (typeof cur === 'object' && cur !== null) {
          const next = (cur as Record<string, unknown>)[p];
          if (next === undefined) {
            found = false;
            break;
          }
          cur = next;
        } else {
          found = false;
          break;
        }
      }
      if (found && typeof cur === 'string') return cur as string;

      // If not found, try a common alias namespace used in locales: `components.<key>`
      // This handles calls like `t('header.aria.openLangMenu')` when the JSON
      // stores the string under `components.header.aria.openLangMenu`.
      try {
        const compKey = `components.${key}`;
        const parts2 = compKey.split('.');
        let cur2: unknown = dict;
        let found2 = true;
        for (const p of parts2) {
          if (typeof cur2 === 'object' && cur2 !== null) {
            const next = (cur2 as Record<string, unknown>)[p];
            if (next === undefined) { found2 = false; break; }
            cur2 = next;
          } else { found2 = false; break; }
        }
        if (found2 && typeof cur2 === 'string') return cur2 as string;
      } catch {}
    }

    // If current locale doesn't have the key, fall back to the Turkish
    // baseline so important sections (e.g. 'uretim.tesis.*') remain visible
    // even when other locale files are incomplete or still loading.
    try {
      const fallback = trLocale as Translations;
      const parts = key.split('.');
      let cur: unknown = fallback;
      let found = true;
      for (const p of parts) {
        if (typeof cur === 'object' && cur !== null) {
          const next = (cur as Record<string, unknown>)[p];
          if (next === undefined) {
            found = false;
            break;
          }
          cur = next;
        } else {
          found = false;
          break;
        }
      }
      if (found && typeof cur === 'string') return cur as string;
      // Also try Turkish fallback under `components.<key>` to catch aliasing in
      // the canonical translations.
      try {
        const compKey = `components.${key}`;
        const parts2 = compKey.split('.');
        let cur2: unknown = fallback;
        let found2 = true;
        for (const p of parts2) {
          if (typeof cur2 === 'object' && cur2 !== null) {
            const next = (cur2 as Record<string, unknown>)[p];
            if (next === undefined) { found2 = false; break; }
            cur2 = next;
          } else { found2 = false; break; }
        }
        if (found2 && typeof cur2 === 'string') return cur2 as string;
      } catch {}
    } catch {
      // ignore fallback errors
    }

    // If dict isn't available or doesn't have the key, consult admin overrides.
    if (overrides) {
      const langLower = String(lang).toLowerCase();
      // Prefer language-scoped override (e.g. 'uretim.tesis.title.en') if present
      const langKey = `${key}.${langLower}`;
      const plainKey = key;

      // 1) language-specific override -> use it
      if (langKey in overrides) {
        const v = overrides[langKey];
        if (v !== null && v !== undefined && String(v).trim() !== '') return v;
      }

      // 2) plain override (fallback)
      if (plainKey in overrides) {
        const v = overrides[plainKey];
        if (v !== null && v !== undefined && String(v).trim() !== '') return v;
      }

      // 3) historic variant: some admin keys used different path (e.g. dropped '.features.') — try it last
      if (key.includes('.features.')) {
        const hist = key.replace('.features.', '.');
        if (hist in overrides) {
          const v = overrides[hist];
          if (v !== null && v !== undefined && String(v).trim() !== '') return v;
        }
      }
    }

    // If neither dict nor overrides provided a value, fall back to the key so
    // callers can detect missing translations during development.
    // Try a few historic/variant key shapes before giving up (common admin
    // export differences: some content used `.text` instead of `.desc`, or
    // used `.lead` etc). This helps recover content when admin keys don't
    // exactly match the code's dot-paths.
    const variants: string[] = [];
    if (key.endsWith('.desc')) variants.push(key.replace(/\.desc$/, '.text'));
    if (key.endsWith('.text')) variants.push(key.replace(/\.text$/, '.desc'));
    if (key.endsWith('.lead')) variants.push(key.replace(/\.lead$/, '.text'));
    if (key.endsWith('.title') && key.includes('.features.')) {
      // historic admin keys flattened 'features' segment (e.g. 'uretim.tesis.modernLines.title')
      variants.push(key.replace('.features.', '.'));
    }

    for (const vk of variants) {
      // check dict first
      try {
        if (dict) {
          const parts = vk.split('.');
          let cur: unknown = dict;
          let found = true;
          for (const p of parts) {
            if (typeof cur === 'object' && cur !== null) {
              const next = (cur as Record<string, unknown>)[p];
              if (next === undefined) { found = false; break; }
              cur = next;
            } else { found = false; break; }
          }
          if (found && typeof cur === 'string') return cur as string;
        }
      } catch {}

      // try Turkish fallback
      try {
        const parts = vk.split('.');
        let cur: unknown = trLocale;
        let found = true;
        for (const p of parts) {
          if (typeof cur === 'object' && cur !== null) {
            const next = (cur as Record<string, unknown>)[p];
            if (next === undefined) { found = false; break; }
            cur = next;
          } else { found = false; break; }
        }
        if (found && typeof cur === 'string') return cur as string;
      } catch {}

      // try overrides
      if (overrides) {
        if (vk in overrides) {
          const v = overrides[vk];
          if (v !== null && v !== undefined && String(v).trim() !== '') return v;
        }
      }
    }

    // last resort: log missing key in development for easier debugging
    if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('[i18n] missing translation', { key, lang });
    }

    return key;
  }, [dict, overrides, lang]);

  // Return the raw translation value (could be string, array or object).
  const g = useCallback((key: string) => {
    // try dict first
    if (dict) {
      try {
        const parts = key.split('.');
        let cur: unknown = dict;
        for (const p of parts) {
          if (typeof cur === 'object' && cur !== null) {
            cur = (cur as Record<string, unknown>)[p];
          } else {
            cur = undefined;
            break;
          }
        }
        if (cur !== undefined) return cur;
      } catch {}
    }

    // fallback to Turkish baseline
    try {
      const parts = key.split('.');
      let cur: unknown = trLocale;
      for (const p of parts) {
        if (typeof cur === 'object' && cur !== null) {
          cur = (cur as Record<string, unknown>)[p];
        } else {
          cur = undefined;
          break;
        }
      }
      if (cur !== undefined) return cur;
    } catch {}

    // finally check overrides (language-scoped then plain)
    if (overrides) {
      const langLower = String(lang).toLowerCase();
      const langKey = `${key}.${langLower}`;
      if (langKey in overrides) return overrides[langKey];
      if (key in overrides) return overrides[key];
      if (key.includes('.features.')) {
        const hist = key.replace('.features.', '.');
        if (hist in overrides) return overrides[hist];
      }
    }

    return undefined;
  }, [dict, overrides, lang]);

  const value = useMemo(() => ({ lang, setLang, t, g }), [lang, t, g]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
