import SEO from '@/components/SEO';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
// Framer Motion typing in this project is a bit strict for intrinsic elements.
// Use a small `any` helper to avoid TS issues when applying `className` to motion elements.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const M: any = motion;

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } },
};

export default function SustPage() {
  const { t, g } = useLanguage();

  // Normalize a value returned from `g()` into an array of T.
  function ensureArray<T = unknown>(v: unknown): T[] {
    if (Array.isArray(v)) return v as T[];
    if (v == null) return [] as T[];
    if (typeof v === 'string') {
      const s = v.trim();
      try {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) return parsed as T[];
      } catch {}
  if (s.includes('\n')) return (s.split(/\r?\n/).map(x => x.trim()).filter(Boolean) as unknown) as T[];
      return [s as unknown as T];
    }
    if (typeof v === 'object') {
      try { return Object.values(v as Record<string, T>); } catch { return [] as T[]; }
    }
    return [] as T[];
  }

  const title = t('sustainability.title');
  const heroLead = t('sustainability.heroLead');
  const metrics = {
    m1: t('sustainability.metrics.m1'),
    m2: t('sustainability.metrics.m2'),
    m3: t('sustainability.metrics.m3'),
  };

  const pillars = ensureArray<{ title: string; desc: string }>(g('sustainability.pillars'));
  const how = {
    title: t('sustainability.how.title'),
    lead: t('sustainability.how.lead'),
    bullets: ensureArray<string>(g('sustainability.how.bullets')),
  };

  const cards = ensureArray<{ title: string; text: string }>(g('sustainability.cards'));
  const imageAlt2 = t('sustainability.imageAlt2');
  const footerNote = t('sustainability.footerNote');

  return (
    <>
  <SEO title={`${title} - Yasar`} description={heroLead} url="/surdurulebilirlik" />

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <M.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }} variants={item} className="relative rounded-xl overflow-hidden shadow-lg mb-10">
          <div className="relative h-64 md:h-80 lg:h-96 bg-gradient-to-br from-amber-50 to-rose-50">
            <Image src="/photos/sustainability-410.svg" alt={t('sustainability.title')} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/70" />

            {/* decorative accent */}
            <svg className="absolute right-6 top-6 opacity-30 w-40 h-40 transform rotate-12" viewBox="0 0 100 100" fill="none" aria-hidden>
              <circle cx="50" cy="50" r="40" fill="url(#g)" />
              <defs>
                <linearGradient id="g" x1="0" x2="1">
                  <stop offset="0" stopColor="#fff7ed" />
                  <stop offset="1" stopColor="#fff1f2" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex items-center">
              <div className="max-w-4xl mx-auto px-6 py-8 md:py-12 flex">
                <div className="bg-white/85 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl max-w-2xl">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-black">{t('sustainability.title')}</h1>
                  <p className="mt-3 text-black/70 max-w-2xl">{t('sustainability.heroLead')}</p>
                  {/* No action buttons on this page by request */}
                </div>
              </div>
            </div>
          </div>
        </M.div>

        {/* Micro-metrics row under hero */}
        <M.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} className="mt-6 mb-10">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 justify-center">
                <M.div variants={item} className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <span className="text-amber-500">✓</span>
                <span className="text-sm font-medium">{t('sustainability.metrics.m1')}</span>
              </M.div>

              <M.div variants={item} className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <span className="text-amber-500">✓</span>
                <span className="text-sm font-medium">{t('sustainability.metrics.m2')}</span>
              </M.div>

              <M.div variants={item} className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <span className="text-amber-500">✓</span>
                <span className="text-sm font-medium">{t('sustainability.metrics.m3')}</span>
              </M.div>
            </div>
          </div>
        </M.div>

        {/* Three pillars — render safely even if `pillars` is empty initially */}
        <M.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} className="grid gap-6 md:grid-cols-3 mb-12">
          {[0, 1, 2].map((i) => {
            const p = pillars[i];
            const titleText = p?.title ?? '';
            const descText = p?.desc ?? '';

            const accent = i === 0 ? {
              ring: 'focus-visible:ring-amber-300',
              bg: 'bg-amber-100',
              color: 'text-amber-600',
              svg: (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C7 7 3 11 3 15c0 3.866 3.582 7 9 7 1.333 0 2.667-.333 4-1.001V13.5C18 11 14 6 12 2z"/></svg>)
            } : i === 1 ? {
              ring: 'focus-visible:ring-rose-300',
              bg: 'bg-rose-100',
              color: 'text-rose-600',
              svg: (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z"/></svg>)
            } : {
              ring: 'focus-visible:ring-sky-300',
              bg: 'bg-sky-100',
              color: 'text-sky-600',
              svg: (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M21 13v6a1 1 0 0 1-1 1h-5l-3-3-3 3H4a1 1 0 0 1-1-1v-6"/></svg>)
            };

            return (
              <M.article key={i} variants={item} className={`p-6 bg-white rounded-lg shadow-sm hover:shadow-lg transform hover:-translate-y-2 transition duration-300 focus:outline-none ${accent.ring}`}>
                <div className={`h-12 w-12 rounded-md ${accent.bg} flex items-center justify-center ${accent.color} mb-3`}>
                  {accent.svg}
                </div>
                <h3 className="font-semibold">{titleText}</h3>
                <p className="mt-2 text-sm text-gray-600">{descText}</p>
              </M.article>
            );
          })}
        </M.div>

        {/* Details & visuals */}
        <M.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={container} className="grid gap-8 md:grid-cols-2 items-start mb-12">
          <M.div variants={item} className="space-y-4">
            <h2 className="text-2xl font-semibold">{t('sustainability.how.title')}</h2>
            <p className="text-gray-700">{t('sustainability.how.lead')}</p>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              {how.bullets.map((b, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <li key={i}>{b}</li>
              ))}
            </ul>
          </M.div>

            <M.div variants={item} className="rounded-lg overflow-hidden shadow-sm">
            <Image src="/photos/sustainability-411.svg" alt={t('sustainability.imageAlt2')} width={900} height={600} className="object-cover w-full h-56 md:h-72" />
          </M.div>
  </M.div>

        {/* Cards */}
        <M.div variants={container} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} className="grid gap-6 md:grid-cols-3 mb-12">
          {cards.map((c) => (
            <M.article key={c.title} variants={item} className="p-5 bg-white rounded-lg shadow-sm hover:shadow-md transition">
              <h4 className="font-semibold">{c.title}</h4>
              <p className="mt-2 text-sm text-gray-600">{c.text}</p>
            </M.article>
          ))}
        </M.div>

        {/* Neutral footer note (no contact CTA on this page) */}
          <M.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={item} className="text-center">
          <p className="text-gray-700">{t('sustainability.footerNote')}</p>
        </M.div>
      </main>
    </>
  );
}
