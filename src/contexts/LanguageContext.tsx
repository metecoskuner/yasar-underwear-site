import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

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
};

const LangContext = createContext<LangContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('TR');
  const [dict, setDict] = useState<Translations | null>(null);

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
    return () => { mounted = false; };
  }, [lang]);


  const setLang = (l: Lang) => {
    setLangState(l);
  };

  const t = useCallback((key: string) => {
    if (!dict) return key;
    const parts = key.split('.');
    let cur: unknown = dict;
    for (const p of parts) {
      if (typeof cur === 'object' && cur !== null) {
        const next = (cur as Record<string, unknown>)[p];
        if (next === undefined) return key;
        cur = next;
      } else {
        return key;
      }
    }
    return typeof cur === 'string' ? cur : key;
  }, [dict]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
