import React from 'react';
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
  return (
    <section
      aria-labelledby="whyus-title"
      className="max-w-6xl mx-auto px-4 py-12 sm:py-16"
    >
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm px-6 py-6 sm:py-8">
        <h2
          id="whyus-title"
          className="text-xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100 text-center mb-5 sm:mb-6"
        >
          Neden Biz?
        </h2>

        <p className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8 text-sm sm:text-base">
          Kurulduğumuz günden bu yana kaliteyi, konforu ve müşteri memnuniyetini merkeze alıyoruz.

        </p>

        <ul className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <SlideLi side="left">
            <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-3 sm:mb-4">
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
            <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">50+ Yıllık Tecrübe</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 sm:mt-2">1969'dan bu yana iç giyim sektöründe uzmanlık, güven ve istikrarlı üretim anlayışı.</p>
          </SlideLi>

          <SlideLi side="right">
            <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-3 sm:mb-4">
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
            <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">Yüksek Kalite Kumaş</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 sm:mt-2">Cilde dost, nefes alabilir ve uzun ömürlü kumaşlar ile maksimum konfor.</p>
          </SlideLi>

          <SlideLi side="left">
            <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-3 sm:mb-4">
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
            <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">Modern & Konforlu Tasarım</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 sm:mt-2">Günlük kullanıma uygun, şık, ergonomik ve kullanıcı odaklı kesimler.</p>
          </SlideLi>

          <SlideLi side="right">
            <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-3 sm:mb-4">
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
            <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">Güvenilir Üretim Standartları</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 sm:mt-2">Her aşamada kontrol edilen dikkatli üretim süreçleri.</p>
          </SlideLi>
        </ul>

        {/* Counters block */}
        <SlideDiv side="left">
          <div className="mt-8 border-t pt-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <Counter end={200000} label="Aylık Üretim Kapasitesi" />
              <Counter end={4500} label="m² Üretim Tesisi" />
              <Counter end={150} label="Çalışan" />
              <Counter end={25} label="Ülkeye İhracat" />
            </div>
          </div>
        </SlideDiv>
      </div>
    </section>
  );
}
