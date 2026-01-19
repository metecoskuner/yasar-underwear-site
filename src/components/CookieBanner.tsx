import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useLanguage } from '@/contexts/LanguageContext';

type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  version: number;
  ts: number;
};

const CONSENT_KEY = 'yasar_cookie_consent';

function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (raw) return JSON.parse(raw) as Consent;
  } catch {
    // ignore
  }
  // try cookie fallback
  try {
    const match = document.cookie.match(new RegExp('(^| )' + CONSENT_KEY + '=([^;]+)'));
    if (match) return JSON.parse(decodeURIComponent(match[2])) as Consent;
  } catch {
    // ignore
  }
  return null;
}

function writeConsent(consent: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  } catch {
    // ignore
  }
  try {
    const v = encodeURIComponent(JSON.stringify(consent));
    // 365 days
    document.cookie = `${CONSENT_KEY}=${v}; max-age=${365 * 24 * 60 * 60}; path=/; samesite=lax`;
  } catch {
    // ignore
  }
  // make available to other scripts at runtime
  try {
    // avoid `any` here to satisfy lint rules
    (window as unknown as { __yasarConsent?: Consent }).__yasarConsent = consent;
  } catch {
    // ignore
  }
}

export default function CookieBanner() {
  const { t } = useLanguage();
  const tr = (key: string, fallback: string) => {
    try {
      const v = t(key);
      return v === key ? fallback : v;
    } catch {
      return fallback;
    }
  };
  const [showSettings, setShowSettings] = useState(false);

  // Initialize consent synchronously from storage to avoid calling setState inside an effect
  const [initialConsent] = useState<Consent | null>(() => readConsent());
  const [consent, setConsent] = useState<Consent | null>(initialConsent);
  const [show, setShow] = useState(() => !initialConsent);

  useEffect(() => {
    if (consent) {
      try {
        (window as unknown as { __yasarConsent?: Consent }).__yasarConsent = consent;
      } catch {
        // ignore
      }
    }
  }, [consent]);

  const save = (partial: Partial<Consent>) => {
    const next: Consent = {
      necessary: true,
      analytics: false,
      marketing: false,
      version: 1,
      ts: Date.now(),
      ...partial,
    } as Consent;
    writeConsent(next);
    setConsent(next);
    setShow(false);
    setShowSettings(false);
  };

  const acceptAll = () => save({ analytics: true, marketing: true });
  const rejectAll = () => save({ analytics: false, marketing: false });

  if (!show) return null;

  // Render the banner into a top-level portal so stacking context issues don't block pointer events
  const banner = (
  <div className="fixed left-4 right-4 bottom-6 z-[9999] md:left-8 md:right-auto md:right-8" role="dialog" aria-label={tr('components.cookieBanner.ariaLabel','Çerez tercihleri')}>
      <div className="max-w-3xl mx-auto bg-white/95 dark:bg-black/80 text-black dark:text-white rounded-lg shadow-2xl ring-1 ring-black/5 p-4 flex flex-col md:flex-row items-start md:items-center gap-3 pointer-events-auto">
        <div className="flex-1 text-sm leading-tight">
          <strong className="block font-semibold">{tr('components.cookieBanner.title','Çerez tercihleri')}</strong>
          <p className="mt-1 text-xs text-gray-700 dark:text-gray-200">{tr('components.cookieBanner.body','Sitemiz deneyimi iyileştirmek için çerezler kullanır. Analitik ve pazarlama çerezlerini kabul edip etmemek size bağlıdır.')}</p>
          <p className="mt-2 text-xs">
            <a href="/privacy" className="underline hover:opacity-90">{tr('components.cookieBanner.privacyLink','Gizlilik Politikası')}</a>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={acceptAll}
            className="bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700 transition"
          >
            {tr('components.cookieBanner.acceptAll','Tümünü kabul et')}
          </button>

          <button
            onClick={() => setShowSettings((s) => !s)}
            className="bg-white border border-gray-200 text-gray-800 px-3 py-2 rounded-md text-sm hover:bg-gray-50 transition"
          >
            {tr('components.cookieBanner.settings','Ayarlar')}
          </button>

          <button
            onClick={rejectAll}
            className="text-sm text-gray-600 px-3 py-2 rounded-md hover:underline"
          >
            {tr('components.cookieBanner.reject','Reddet')}
          </button>
        </div>

        {showSettings && (
          <div className="mt-3 w-full md:w-96 bg-white dark:bg-black/90 rounded-md p-3 border border-gray-100 shadow-lg">
            <h4 className="font-medium">{tr('components.cookieBanner.settingsTitle','Çerez ayarları')}</h4>
            <p className="text-xs text-gray-600 mt-1">{tr('components.cookieBanner.settingsBody','Hangi çerezleri kabul etmek istediğinizi seçin.')}</p>

            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{tr('components.cookieBanner.required.title','Zorunlu')}</div>
                  <div className="text-xs text-gray-600">{tr('components.cookieBanner.required.body','Site çalışması için gerekli çerezler (devre dışı bırakılamaz).')}</div>
                </div>
                <div className="text-sm text-gray-500">Etkin</div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{tr('components.cookieBanner.analytics.title','Analitik')}</div>
                  <div className="text-xs text-gray-600">{tr('components.cookieBanner.analytics.body','Site kullanımını anlamamıza yardımcı olur.')}</div>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-green-600"
                      defaultChecked={false}
                      onChange={(e) => {
                        const checked = e.currentTarget.checked;
                        // temporary local save until kaydet
                        const prev = readConsent();
                        const draft = prev || { necessary: true, analytics: false, marketing: false, version: 1, ts: Date.now() };
                        draft.analytics = checked;
                        writeConsent(draft);
                        setConsent(draft);
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{tr('components.cookieBanner.marketing.title','Pazarlama')}</div>
                  <div className="text-xs text-gray-600">{tr('components.cookieBanner.marketing.body','Reklam ve hedefleme çerezleri.')}</div>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-green-600"
                      defaultChecked={false}
                      onChange={(e) => {
                        const checked = e.currentTarget.checked;
                        const prev = readConsent();
                        const draft = prev || { necessary: true, analytics: false, marketing: false, version: 1, ts: Date.now() };
                        draft.marketing = checked;
                        writeConsent(draft);
                        setConsent(draft);
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-2">
                <button onClick={() => setShowSettings(false)} className="px-3 py-1 text-sm rounded-md">{tr('components.cookieBanner.cancel','Vazgeç')}</button>
                <button
                  onClick={() => {
                    const cur = readConsent() || { necessary: true, analytics: false, marketing: false, version: 1, ts: Date.now() };
                    save({ analytics: cur.analytics, marketing: cur.marketing });
                  }}
                  className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                >
                  {tr('components.cookieBanner.save','Kaydet')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Only render portal on client
  if (typeof document === 'undefined') return null;
  const portalRoot = document.body;
  return ReactDOM.createPortal(banner, portalRoot);
}
