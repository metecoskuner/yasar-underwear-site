import { useState } from 'react'
import type { Page, Section, ContentStore } from '@/types/content'
import SectionEditor from './SectionEditor'
import LanguageTabs from './LanguageTabs'

type Props = {
  initialStore: ContentStore | null
  initialPage?: Page | null
  onSave: (store: ContentStore) => Promise<void>
}

export default function ContentEditor({ initialStore, initialPage, onSave }: Props) {
  const [store, setStore] = useState<ContentStore>(initialStore || { pages: [] })
  const [page, setPage] = useState<Page>(initialPage || { id: cryptoRandom(), slug: '', sections: [] })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  function cryptoRandom() {
    return Math.random().toString(36).slice(2, 9)
  }

  function updatePage(patch: Partial<Page>) {
    const next = { ...page, ...patch }
    setPage(next)
  }

  function updateSection(index: number, s: Section) {
    const sections = [...page.sections]
    sections[index] = s
    setPage({ ...page, sections })
  }

  function addSection() {
    const s: Section = { id: cryptoRandom(), type: 'text', content: {} }
    setPage({ ...page, sections: [...page.sections, s] })
  }

  function removeSection(idx: number) {
    const sections = page.sections.filter((_, i) => i !== idx)
    setPage({ ...page, sections })
  }

  async function doSave() {
    setSaving(true)
    setMessage(null)
    try {
      const pages = (store.pages || []).filter((p) => p.id !== page.id)
      const nextStore = { ...store, pages: [...pages, page] }
      await onSave(nextStore)
      setStore(nextStore)
      setMessage('Kaydedildi')
    } catch (err) {
      void err
      setMessage('Kaydetme başarısız')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-4 bg-white p-4 rounded border">
        <label className="block text-sm text-gray-700">Slug (URL parçası)</label>
        <input className="w-full border rounded px-3 py-2" value={page.slug} onChange={(e) => updatePage({ slug: e.target.value })} />

        <div className="mt-3">
          <label className="block text-sm text-gray-700 mb-2">Sayfa Başlığı</label>
          <LanguageTabs
            values={(page.title as Record<string, { title?: string } | string> | undefined) || { en: { title: '' }, tr: { title: '' }, fr: { title: '' } }}
            onChange={(lang, val) => {
              const titleObj = { ...(page.title || {}) } as Record<string, { title?: string } | string>
              // allow simple string or object; store as object with title
              titleObj[lang] = typeof val === 'string' ? { title: val } : (val as { title?: string })
              updatePage({ title: titleObj })
            }}
            render={(lang, value, setVal) => (
              <input className="w-full border rounded px-3 py-2" value={(value as import('@/types/content').LocalizedContent)?.title ?? ''} onChange={(e) => setVal({ ...((value as import('@/types/content').LocalizedContent) || {}), title: e.target.value })} />
            )}
          />
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {page.sections.map((s, i) => (
          <SectionEditor key={s.id} section={s} onChange={(ns) => updateSection(i, ns)} onRemove={() => removeSection(i)} />
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={doSave} disabled={saving}>{saving ? 'Kaydediliyor...' : 'Sayfayı Kaydet'}</button>
        {message && <div className="text-sm text-gray-700">{message}</div>}
      </div>
    </div>
  )
}
