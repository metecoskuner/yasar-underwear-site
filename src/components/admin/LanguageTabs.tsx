import { useState } from 'react'
import React from 'react'
import type { LocalizedContent } from '@/types/content'

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'tr', label: 'TR' },
  { code: 'fr', label: 'FR' },
  { code: 'ru', label: 'RU' },
  { code: 'ar', label: 'AR' }
]

type Props = {
  values: Record<string, LocalizedContent | string | undefined>
  onChange: (lang: string, value: LocalizedContent | string) => void
  render: (lang: string, value: LocalizedContent | string | undefined, onChange: (v: LocalizedContent | string) => void) => React.ReactNode
}

export default function LanguageTabs({ values, onChange, render }: Props) {
  const [active, setActive] = useState('en')
  return (
    <div>
      <div className="flex space-x-2 mb-3">
        {LANGS.map((l) => (
          <button key={l.code} type="button" onClick={() => setActive(l.code)} className={`px-3 py-1 rounded ${active === l.code ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
            {l.label}
          </button>
        ))}
      </div>
      <div>
        {render(active, values[active], (v) => onChange(active, v))}
      </div>
    </div>
  )
}
