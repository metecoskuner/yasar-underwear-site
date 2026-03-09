import HeroSlider from './HeroSlider';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();

  const tr = (key: string, fallback: string) => {
    try {
      const v = t(key);
      return v === key ? fallback : v;
    } catch {
      return fallback;
    }
  };

  const title = tr('components.hero.title', 'Konfor & Şıklık — Her Gün')
  const subtitle = tr('components.hero.subtitle', "Yumuşak, nefes alan iç giyim koleksiyonumuzla rahatlığı ve zarafeti keşfedin. Türkiye'de tasarlandı.")

  return (
    <section className="relative overflow-hidden">
      {/* Use HeroSlider without slides prop so it falls back to default static images in code */}
      <HeroSlider />

      <div className="relative max-w-6xl mx-auto px-4 py-20 sm:py-32 lg:py-44 xl:py-56 2xl:py-72 flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-white">{title}</h1>
        <p className="text-white/90 max-w-2xl mb-6">{subtitle}</p>
        {/* Info cards remain handled by HeroInfoCards elsewhere */}
      </div>
    </section>
  );
}