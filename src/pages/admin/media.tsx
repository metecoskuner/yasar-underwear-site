import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'

type FileEntry = { name: string; url: string }

const AdminMediaPage: NextPage = () => {
  const [videos, setVideos] = useState<FileEntry[]>([])
  const [uploads, setUploads] = useState<FileEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/media-files', { credentials: 'same-origin' })
        const data = await res.json()
        setVideos(data.videos || [])
        setUploads(data.uploads || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Medya Yöneticisi</h1>
      {loading ? (
        <div>Yükleniyor…</div>
      ) : (
        <div className="space-y-6">
          <section>
            <h2 className="text-xl mb-2">Videolar</h2>
            {videos.length === 0 ? (
              <div className="text-muted">`public/videos` içinde dosya yok.</div>
            ) : (
              <ul className="list-disc pl-5">
                {videos.map(v => (
                  <li key={v.name} className="mb-1">
                    <a href={v.url} target="_blank" rel="noreferrer" className="text-blue-600 underline mr-3">{v.name}</a>
                    <button onClick={() => navigator.clipboard.writeText(location.origin + v.url)} className="text-sm text-gray-600">URL kopyala</button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="text-xl mb-2">Yüklemeler</h2>
            {uploads.length === 0 ? (
              <div className="text-muted">`public/uploads` içinde dosya yok.</div>
            ) : (
              <ul className="list-disc pl-5">
                {uploads.map(u => (
                  <li key={u.name} className="mb-1">
                    <a href={u.url} target="_blank" rel="noreferrer" className="text-blue-600 underline mr-3">{u.name}</a>
                    <button onClick={() => navigator.clipboard.writeText(location.origin + u.url)} className="text-sm text-gray-600">URL kopyala</button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

export default AdminMediaPage
