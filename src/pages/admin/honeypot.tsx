import AdminLayout from '@/components/admin/AdminLayout'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import type { GetServerSideProps } from 'next'
import { isAuthed } from '@/lib/adminAuth'

type Log = { id: string; ip: string; userAgent?: string | null; submittedValue?: string | null; createdAt: string }

export default function HoneypotAdminPage() {
  const [logs, setLogs] = useState<Log[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(25)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)
  const [ipFilter, setIpFilter] = useState<string>('')

  useEffect(() => {
    void load()
  }, [page])

  async function load() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('limit', String(limit))
      if (startDate) params.set('startDate', startDate)
      if (endDate) params.set('endDate', endDate)
      if (ipFilter) params.set('ip', ipFilter)
      const r = await fetch(`/api/admin/honeypot?${params.toString()}`, { credentials: 'same-origin' })
      if (!r.ok) {
        setLogs([])
        return
      }
      const j = await r.json()
      setLogs(Array.isArray(j.logs) ? j.logs : [])
      setTotal(typeof j.total === 'number' ? j.total : 0)
    } catch (err) {
      console.error('load honeypot', err)
      setLogs([])
    } finally {
      setLoading(false)
    }
  }

  const pages = Math.max(1, Math.ceil(total / limit))
  const isRecent = (d: string) => {
    try {
      const when = new Date(d)
      return Date.now() - when.getTime() < 1000 * 60 * 60 * 24 // last 24h
    } catch { return false }
  }

  const exportParams = new URLSearchParams()
  if (startDate) exportParams.set('startDate', startDate)
  if (endDate) exportParams.set('endDate', endDate)
  if (ipFilter) exportParams.set('ip', ipFilter)
  const exportHref = `/api/admin/honeypot_export?${exportParams.toString()}`

  return (
    <AdminLayout>
      <Head><title>Admin - Honeypot Hits</title></Head>
      <div className="bg-white p-6 rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Honeypot Kayıtları</h2>
        </div>

        <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-xs text-gray-600">Başlangıç</label>
            <input type="date" value={startDate ?? ''} onChange={(e) => setStartDate(e.target.value || null)} className="border rounded px-2 py-1 w-full" />
          </div>
          <div>
            <label className="block text-xs text-gray-600">Bitiş</label>
            <input type="date" value={endDate ?? ''} onChange={(e) => setEndDate(e.target.value || null)} className="border rounded px-2 py-1 w-full" />
          </div>
          <div>
            <label className="block text-xs text-gray-600">IP Ara</label>
            <input placeholder="IP veya parça" value={ipFilter} onChange={(e) => setIpFilter(e.target.value)} className="border rounded px-2 py-1 w-full" />
          </div>
          <div className="flex space-x-2">
            <button onClick={() => { setPage(1); void load() }} className="bg-blue-600 text-white px-3 py-1 rounded">Ara</button>
            <button onClick={() => { setStartDate(null); setEndDate(null); setIpFilter(''); setPage(1); void load() }} className="bg-gray-100 px-3 py-1 rounded">Temizle</button>
            <a href={exportHref} download={`honeypot_hits.csv`} className={`inline-flex items-center px-3 py-1 rounded ${total === 0 ? 'opacity-50 pointer-events-none bg-gray-100' : 'bg-green-600 text-white'}`}>Export CSV</a>
          </div>
        </div>

        {loading && <div className="text-sm text-gray-500">Yükleniyor...</div>}

        {!loading && logs.length === 0 && <div className="text-sm text-gray-600">Kayıt yok.</div>}

        {!loading && logs.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500">
                  <th className="py-2 pr-4">Tarih</th>
                  <th className="py-2 pr-4">IP</th>
                  <th className="py-2 pr-4">User Agent</th>
                  <th className="py-2 pr-4">Submitted Value</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.id} className={`${isRecent(l.createdAt) ? 'bg-yellow-50' : ''} border-t`}> 
                    <td className="py-2 pr-4 align-top">{new Date(l.createdAt).toLocaleString()}</td>
                    <td className="py-2 pr-4 align-top font-mono text-xs">{l.ip}</td>
                    <td className="py-2 pr-4 align-top max-w-md truncate">{l.userAgent}</td>
                    <td className="py-2 pr-4 align-top max-w-sm truncate">{l.submittedValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">Toplam: {total}</div>
              <div className="flex items-center space-x-2">
                <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50">Önceki</button>
                <div className="text-sm">{page} / {pages}</div>
                <button disabled={page >= pages} onClick={() => setPage((p) => Math.min(pages, p + 1))} className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50">Sonraki</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const authed = await isAuthed(context.req)
    if (!authed) return { redirect: { destination: '/admin', permanent: false } }
  } catch (err) {
    void err
    return { redirect: { destination: '/admin', permanent: false } }
  }
  return { props: {} }
}
