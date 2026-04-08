import Link from 'next/link'
import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function HeroInfoCards() {
  const { t } = useLanguage();
  return (
    <section className="w-full py-10 sm:py-14">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-4 md:grid-cols-2 md:gap-6 items-stretch">
        <div className="relative overflow-hidden rounded-[28px] border border-stone-200/80 bg-[linear-gradient(145deg,#ffffff_0%,#f8fafc_100%)] p-7 shadow-[0_28px_70px_-45px_rgba(15,23,42,0.35)] sm:p-8 text-left flex flex-col">
          <div className="mb-5 inline-flex w-fit rounded-full border border-stone-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {t('components.heroInfoCards.wholesale.eyebrow')}
          </div>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-900">{t('components.heroInfoCards.wholesale.title')}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base flex-1">{t('components.heroInfoCards.wholesale.description')}</p>
          <div className="mt-6">
            <Link href="/wholesale" className="group inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700">
              <span className="transition-transform duration-200 group-hover:-translate-x-1">{t('components.heroInfoCards.wholesale.cta')}</span>
              <span className="ml-3 inline-block transform translate-x-3 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true">
                <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12h14"></path>
                  <path d="M13 5l7 7-7 7"></path>
                </svg>
              </span>
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-stone-200/80 bg-[linear-gradient(145deg,#fffaf0_0%,#ffffff_100%)] p-7 shadow-[0_28px_70px_-45px_rgba(15,23,42,0.35)] sm:p-8 text-left flex flex-col">
          <div className="mb-5 inline-flex w-fit rounded-full border border-amber-200/80 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-800">
            {t('components.heroInfoCards.private.eyebrow')}
          </div>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-900">{t('components.heroInfoCards.private.title')}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base flex-1">{t('components.heroInfoCards.private.description')}</p>
          <div className="mt-6">
            <Link href="/private-label" className="group inline-flex items-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-stone-50">
              <span className="transition-transform duration-200 group-hover:-translate-x-1">{t('components.heroInfoCards.private.cta')}</span>
              <span className="ml-3 inline-block transform translate-x-3 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true">
                <svg className="h-4 w-4 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
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
