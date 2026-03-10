import Link from 'next/link'
import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function HeroInfoCards() {
  const { t } = useLanguage();
  return (
    <section className="w-full mt-12 md:mt-20 mb-12">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-4 items-stretch">
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-lg shadow-md text-left flex flex-col">
          <h3 className="text-2xl font-semibold">{t('components.heroInfoCards.wholesale.title')}</h3>
          <p className="mt-3 text-base text-gray-700 flex-1">{t('components.heroInfoCards.wholesale.description')}</p>
          <div className="mt-6">
            <Link href="/wholesale" className="group inline-flex items-center px-4 py-2 rounded-md bg-amber-400 text-black font-semibold text-base overflow-hidden">
              <span className="transition-transform duration-200 group-hover:-translate-x-1">{t('components.heroInfoCards.wholesale.cta')}</span>
              <span className="ml-3 inline-block transform translate-x-3 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true">
                <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12h14"></path>
                  <path d="M13 5l7 7-7 7"></path>
                </svg>
              </span>
            </Link>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-lg shadow-md text-left flex flex-col">
          <h3 className="text-2xl font-semibold">{t('components.heroInfoCards.private.title')}</h3>
          <p className="mt-3 text-base text-gray-700 flex-1">{t('components.heroInfoCards.private.description')}</p>
          <div className="mt-6">
            <Link href="/private-label" className="group inline-flex items-center px-4 py-2 rounded-md bg-amber-400 text-black font-semibold text-base overflow-hidden">
              <span className="transition-transform duration-200 group-hover:-translate-x-1">{t('components.heroInfoCards.private.cta')}</span>
              <span className="ml-3 inline-block transform translate-x-3 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true">
                <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12h14"></path>
                  <path d="M13 5l7 7-7 7"></path>
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
