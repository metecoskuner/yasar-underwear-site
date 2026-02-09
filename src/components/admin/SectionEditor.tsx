import { useState } from 'react'
import LanguageTabs from './LanguageTabs'
import type { Section, LocalizedContent } from '@/types/content'

type Props = {
  section: Section
  onChange: (s: Section) => void
  onRemove?: () => void
}

export default function SectionEditor({ section, onChange, onRemove }: Props) {
  const [local, setLocal] = useState<Section>(section)

  function update(patch: Partial<Section>) {
    const next = { ...local, ...patch }
    setLocal(next)
    onChange(next)
  }

  return (
    <div className="border rounded p-3 bg-white">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-700">Tür:</label>
          <select value={local.type} onChange={(e) => update({ type: e.target.value })} className="border rounded px-2 py-1 text-sm">
            <option value="hero">Hero</option>
            <option value="text">Metin</option>
            <option value="gallery">Galeri</option>
            <option value="video">Video</option>
          </select>
        </div>
        {onRemove && <button onClick={onRemove} className="text-sm text-red-600">Kaldır</button>}
      </div>

      <LanguageTabs
        values={local.content}
        onChange={(lang, val) => {
          // LanguageTabs may provide either a string or an object; normalize to LocalizedContent
          const normalized = typeof val === 'string' ? { title: val } : val
          const content = { ...(local.content || {}), [lang]: normalized }
          update({ content })
        }}
        render={(lang, value, setVal) => {
          // value may be a string or object; treat strings as { title }
          const v = (typeof value === 'string' ? { title: value } : (value || {})) as LocalizedContent
          return (
            <div className="space-y-2">
              <input className="w-full border rounded px-3 py-2" placeholder="Başlık" value={v.title ?? ''} onChange={(e) => setVal({ ...v, title: e.target.value })} />
              <textarea className="w-full border rounded px-3 py-2" placeholder="Açıklama" value={v.description ?? ''} onChange={(e) => setVal({ ...v, description: e.target.value })} />
              {local.type === 'gallery' && (
                <div>
                  <label className="text-sm">Resimler (virgülle ayrılmış URL&apos;ler)</label>
                  <input className="w-full border rounded px-3 py-2" value={(v.images || []).join(', ')} onChange={(e) => setVal({ ...v, images: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })} />
                </div>
              )}
              {local.type === 'video' && (
                <div>
                  <label className="text-sm">Video URL&apos;si</label>
                  <input className="w-full border rounded px-3 py-2" value={v.video ?? ''} onChange={(e) => setVal({ ...v, video: e.target.value })} />
                </div>
              )}
            </div>
          )
        }}
      />
    </div>
  )
}
