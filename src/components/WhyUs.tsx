import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Counter from './Counter';
import { useInView } from '../hooks/useInView';

function SlideLi({ side = 'left', children }: { side?: 'left' | 'right'; children: React.ReactNode }) {
  const { ref, inView } = useInView<HTMLLIElement>({ threshold: 0.15 });
  return (
    <li
      ref={ref}
      data-side={side}
      className={`slide-section ${inView ? 'in-view' : ''} flex flex-col items-center text-center px-4`}
    >
      {children}
    </li>
  );
}

function SlideDiv({ side = 'left', children }: { side?: 'left' | 'right'; children: React.ReactNode }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  return (
    <div
      ref={ref}
      data-side={side}
      className={`slide-section ${inView ? 'in-view' : ''}`}
    >
      {children}
    </div>
  );
}

export default function WhyUs() {
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
    <section
      aria-labelledby="whyus-title"
      className="max-w-6xl mx-auto px-4 py-12 sm:py-16"
      style={{ colorScheme: 'light', forcedColorAdjust: 'none' }}
    >
      <div className="rounded-[32px] border border-stone-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-6 py-8 shadow-[0_30px_80px_-55px_rgba(15,23,42,0.28)] sm:px-8 sm:py-10">
        <h2
          id="whyus-title"
          className="mb-5 text-center text-2xl font-semibold tracking-tight text-gray-900 sm:mb-6 sm:text-4xl"
        >
          {tr('components.whyUs.title','Neden Biz?')}
        </h2>

            <p className="mx-auto mb-8 max-w-2xl text-center text-sm leading-6 text-gray-600 sm:mb-10 sm:text-base">
          {tr('components.whyUs.intro','Kurulduğumuz günden bu yana kaliteyi, konforu ve müşteri memnuniyetini merkeze alıyoruz.')}

        </p>

        <ul className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <SlideLi side="left">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 sm:mb-4 sm:h-16 sm:w-16">
              {/* Medal / experience icon */}
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2a3 3 0 00-3 3v.26A6.5 6.5 0 006 12a6.5 6.5 0 003 5.74V21l3-1 3 1v-3.26A6.5 6.5 0 0018 12a6.5 6.5 0 00-3-6.74V5a3 3 0 00-3-3z" />
              </svg>
            </div>
            <h3 className="text-base font-medium text-gray-900 sm:text-lg">{tr('components.whyUs.experience.title','50+ Yıllık Tecrübe')}</h3>
            <p className="mt-1 text-xs text-gray-600 sm:mt-2 sm:text-sm">{tr('components.whyUs.experience.body',"1969'dan bu yana iç giyim sektöründe uzmanlık, güven ve istikrarlı üretim anlayışı.")}</p>
          </SlideLi>

          <SlideLi side="right">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 sm:mb-4 sm:h-16 sm:w-16">
              {/* Fabric / quality icon */}
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v2a6 6 0 01-6 6H10a6 6 0 01-6-6V6z" />
                <path d="M4 13v2a3 3 0 003 3h10a3 3 0 003-3v-2" opacity=".6" />
              </svg>
            </div>
            <h3 className="text-base font-medium text-gray-900 sm:text-lg">{tr('components.whyUs.quality.title','Yüksek Kalite Kumaş')}</h3>
            <p className="mt-1 text-xs text-gray-600 sm:mt-2 sm:text-sm">{tr('components.whyUs.quality.body','Cilde dost, nefes alabilir ve uzun ömürlü kumaşlar ile maksimum konfor.')}</p>
          </SlideLi>

          <SlideLi side="left">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 sm:mb-4 sm:h-16 sm:w-16">
              {/* Modern & comfortable icon */}
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-teal-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M3 12a9 9 0 0118 0v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" />
                <path d="M7 9a5 5 0 0110 0v1H7V9z" opacity=".9" />
              </svg>
            </div>
            <h3 className="text-base font-medium text-gray-900 sm:text-lg">{tr('components.whyUs.design.title','Modern & Konforlu Tasarım')}</h3>
            <p className="mt-1 text-xs text-gray-600 sm:mt-2 sm:text-sm">{tr('components.whyUs.design.body','Günlük kullanıma uygun, şık, ergonomik ve kullanıcı odaklı kesimler.')}</p>
          </SlideLi>

          <SlideLi side="right">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 sm:mb-4 sm:h-16 sm:w-16">
              {/* Shield / production standards icon */}
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-rose-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2l7 3v5c0 5-3.5 9.7-7 11-3.5-1.3-7-6-7-11V5l7-3z" />
                <path d="M10 11l2 2 4-4" stroke="#fff" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-base font-medium text-gray-900 sm:text-lg">{tr('components.whyUs.standards.title','Güvenilir Üretim Standartları')}</h3>
            <p className="mt-1 text-xs text-gray-600 sm:mt-2 sm:text-sm">{tr('components.whyUs.standards.body','Her aşamada kontrol edilen dikkatli üretim süreçleri.')}</p>
          </SlideLi>
        </ul>

        {/* Counters block */}
        <SlideDiv side="left">
          <div className="mt-8 border-t border-stone-200 pt-8">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
              <Counter end={200000} label={tr('components.whyUs.counters.monthlyCapacity','Aylık Üretim Kapasitesi')} />
              <Counter end={4500} label={tr('components.whyUs.counters.facilityArea','m² Üretim Tesisi')} />
              <Counter end={150} label={tr('components.whyUs.counters.employees','Çalışan')} />
              <Counter end={25} label={tr('components.whyUs.counters.exportCountries','Ülkeye İhracat')} />
              </div>
          </div>
        </SlideDiv>
      </div>
    </section>
  );
}
