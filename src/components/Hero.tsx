import Link from 'next/link';
import HeroSlider from './HeroSlider';
import { useState } from 'react';
import QuoteModal from './QuoteModal';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Hero() {
  const [openQuote, setOpenQuote] = useState(false);
  const { t } = useLanguage();
  const tr = (key: string, fallback: string) => {
    try {
      const v = t(key);
      return v === key ? fallback : v;
    } catch {
      return fallback;
    }
  };
  return (
    <section className="relative overflow-hidden">
      <HeroSlider />
      <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-28 flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">{tr('components.hero.title','Konfor & Şıklık — Her Gün')}</h1>
        <p className="text-gray-700 max-w-2xl mb-6">{tr('components.hero.subtitle',"Yumuşak, nefes alan iç giyim koleksiyonumuzla rahatlığı ve zarafeti keşfedin. Türkiye'de tasarlandı.")}</p>
        <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0 items-center justify-center">
          <Link href="/urunler" className="inline-block bg-black text-white px-6 py-3 rounded-full font-semibold shadow hover:opacity-95">{tr('components.hero.ctaCollections','Koleksiyonları Gör')}</Link>
          <button onClick={() => setOpenQuote(true)} className="inline-block border border-black text-black px-5 py-3 rounded-full font-medium hover:bg-black hover:text-white transition cursor-pointer">{tr('components.hero.ctaQuote','Teklif Al')}</button>
        </div>
      </div>
      <QuoteModal open={openQuote} onClose={() => setOpenQuote(false)} />
    </section>
  );
}