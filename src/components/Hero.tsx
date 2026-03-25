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
    <section className="relative w-full h-[70vh] sm:h-[80vh] md:h-[600px] lg:h-[700px] overflow-hidden">
      <HeroSlider />
    </section>
  );
}