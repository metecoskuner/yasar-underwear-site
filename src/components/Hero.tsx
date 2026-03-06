import HeroSlider from './HeroSlider';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Hero() {
  
  const { t, lang } = useLanguage();
  const [heroContent, setHeroContent] = useState<Record<string, unknown> | null>(null)

  const tr = (key: string, fallback: string) => {
    try {
      const v = t(key);
      return v === key ? fallback : v;
    } catch {
      return fallback;
    }
  };

  // No hero action buttons per request — hero only shows title/subtitle
  useEffect(() => {
    let mounted = true
    async function load() {
      try {
  const res = await fetch('/api/content', { cache: 'no-store' })
        if (!res.ok) return
        const j = await res.json()
        const content = j?.content ?? null
        if (!mounted) return
        setHeroContent(content?.hero ?? null)
      } catch {
        // ignore
      }
    }
    void load()
    return () => { mounted = false }
  }, [])
  const langKey = String(lang).toLowerCase()
  const localizedTitle = heroContent?.title && typeof heroContent.title === 'object' && ((heroContent.title as Record<string, unknown>)[langKey] || '').toString().trim() ? (heroContent.title as Record<string, unknown>)[langKey] as string : null
  const localizedSubtitle = heroContent?.subtitle && typeof heroContent.subtitle === 'object' && ((heroContent.subtitle as Record<string, unknown>)[langKey] || '').toString().trim() ? (heroContent.subtitle as Record<string, unknown>)[langKey] as string : null

  return (
    <section className="relative overflow-hidden">
      <HeroSlider slides={Array.isArray(heroContent?.images) ? heroContent.images : undefined} />
  <div className="relative max-w-6xl mx-auto px-4 py-20 sm:py-32 lg:py-44 xl:py-56 2xl:py-72 flex flex-col items-center text-center">
    <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-white">{localizedTitle ?? tr('components.hero.title','Konfor & Şıklık — Her Gün')}</h1>
  <p className="text-white/90 max-w-2xl mb-6">{localizedSubtitle ?? tr('components.hero.subtitle', "Yumuşak, nefes alan iç giyim koleksiyonumuzla rahatlığı ve zarafeti keşfedin. Türkiye'de tasarlandı.")}</p>
        {/* Info cards moved to `HeroInfoCards` and rendered on the homepage between hero and videos */}
      </div>
      {/* Quote modal removed per request */}
    </section>
  );
}