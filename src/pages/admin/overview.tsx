import AdminLayout from '@/components/admin/AdminLayout'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { isAuthed } from '@/lib/adminAuth'
import fs from 'fs'
import path from 'path'
// prisma client is imported lazily inside getServerSideProps to avoid
// module-load failures in serverless/CI environments where the native
// prisma engine may not be available at import time.

type OverviewProps = {
  stats: {
    messages: number
    unreadMessages?: number
    offers?: number
    products: number
  }
  recentMessages: Array<{ id: string; from?: string; createdAt?: string }>
  recentProducts: Array<{ id: string; title?: string; createdAt?: string }>
}

export default function OverviewPage({ stats, recentMessages, recentProducts }: OverviewProps) {
  return (
    <AdminLayout>
      <Head>
        <title>Yönetici - Genel Bakış</title>
      </Head>

      <div className="mx-auto max-w-6xl px-0">
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-pink-600 to-yellow-500 p-5 text-white shadow-lg sm:p-6">
          <h1 className="text-2xl font-semibold sm:text-3xl">Genel Bakış</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 opacity-90">Kısa istatistikler, son aktiviteler ve hızlı yönetim bağlantılarını buradan takip edebilirsiniz.</p>
        </div>

        <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col rounded-2xl bg-white p-4 shadow-sm">
              <div className="text-sm font-medium text-gray-500">Mesajlar</div>
              <div className="mt-3 text-3xl font-extrabold text-gray-800">{stats.messages}</div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Okunmamış</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">{stats.unreadMessages ?? '-'}</span>
                </div>
                <span className="text-gray-300">/</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Toplam</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">{stats.messages}</span>
                </div>
              </div>
            </div>
          <div className="flex flex-col rounded-2xl bg-white p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-500">Ürünler</div>
            <div className="mt-3 text-3xl font-extrabold text-gray-800">{stats.products}</div>
            <div className="mt-2 text-sm text-gray-400">Katalogta kayıtlı ürün sayısı</div>
          </div>
        </section>

        <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <h3 className="font-medium text-gray-800">Son Mesajlar</h3>
            <ul className="mt-3 text-sm text-gray-600 space-y-3">
              {recentMessages.length === 0 ? <li className="text-gray-400">Mesaj bulunamadı.</li> : recentMessages.map((m) => (
                <li key={m.id} className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{m.from ?? 'Anonim'}</div>
                    <div className="text-xs text-gray-400">{m.createdAt ?? ''}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* recent offers removed as quote/offer feature has been removed */}
        </section>

        <section className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Yeni Ürünler</h3>
            <div className="text-sm text-gray-500">Son eklenen 5 ürün</div>
          </div>
          <div className="flex flex-col gap-3">
            {recentProducts.length === 0 ? (
              <div className="text-gray-400">Yeni ürün yok.</div>
            ) : recentProducts.map((p, i) => (
              <div key={p.id} className="flex min-h-20 flex-col gap-3 rounded-xl border bg-white p-4 transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{p.title ?? p.id}</div>
                  <div className="text-xs text-gray-400 mt-1">{p.createdAt ?? ''}</div>
                </div>
                <div className={`flex h-9 w-14 shrink-0 items-center justify-center rounded-full text-xs text-white sm:ml-4 ${['bg-indigo-500','bg-pink-500','bg-yellow-500','bg-green-500','bg-sky-500'][i % 5]}`}>
                  Yeni
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
  const authed = await isAuthed(context.req)
  if (!authed) return { redirect: { destination: '/admin', permanent: false } }
  } catch (err) { void err; return { redirect: { destination: '/admin', permanent: false } } }

  // Default empty results
  let stats: { messages: number; unreadMessages?: number; offers?: number; products: number } = { messages: 0, products: 0 }
  let recentMessages: Array<{ id: string; from?: string; createdAt?: string }> = []
  let recentProducts: Array<{ id: string; title?: string; createdAt?: string }> = []

  try {
    if (process.env.DATABASE_URL) {
      // Use DB-backed counts and recent items (offers/quoteRequests removed)
      // Import prisma lazily so module-load failures in CI/serverless
      // don't crash page collection.
      try {
        const { prisma } = await import('@/lib/prisma')
        const [messagesCount, unreadCount, productsCount] = await Promise.all([
          prisma.contactMessage.count(),
          prisma.contactMessage.count({ where: { read: false } }),
          prisma.product.count(),
        ])
        stats = { messages: messagesCount, unreadMessages: unreadCount, products: productsCount }

        const [msgs, products] = await Promise.all([
          prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
          prisma.product.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
        ])
        recentMessages = msgs.map((m) => ({ id: m.id, from: m.name || 'Anonim', createdAt: m.createdAt?.toISOString() }))
        recentProducts = products.map((p) => ({ id: String(p.id), title: (typeof p.title === 'string' ? p.title : JSON.stringify(p.title)) || '', createdAt: p.createdAt?.toISOString() ?? undefined }))
      } catch (err) {
        // If DB access or prisma import fails in the build environment,
        // swallow and fall back to file-based data below.
        void err
      }
    } else {
      // File-based fallback: read JSON files from /data
      const base = process.cwd()
      try {
        const msgsRaw = fs.readFileSync(path.join(base, 'data', 'admin-messages.json'), 'utf-8')
        const parsed = JSON.parse(msgsRaw) as { messages?: unknown }
        const msgsArr = Array.isArray(parsed.messages) ? (parsed.messages as unknown[]) : []
        stats.messages = msgsArr.length
        // Compute unread count from file data. Accept multiple possible shapes for `read`.
        const isRead = (v: unknown) => v === true || v === 'true' || v === 1 || v === '1'
        const unreadFromFile = msgsArr.filter((m) => { const r = (m as Record<string, unknown>).read; return !isRead(r) }).length
        stats.unreadMessages = unreadFromFile
        recentMessages = msgsArr.slice(0, 5).map((m) => {
          const rec = m as Record<string, unknown>
          return { id: String(rec.id ?? Date.now()), from: String(rec.from ?? rec.name ?? 'Anonim'), createdAt: (rec.createdAt ? String(rec.createdAt) : undefined) }
        })
      } catch { /* ignore */ }

      // offers file fallback removed

      try {
        const prodRaw = fs.readFileSync(path.join(base, 'data', 'products.json'), 'utf-8')
        const parsed = JSON.parse(prodRaw) as unknown
        const prodsArr = Array.isArray(parsed) ? (parsed as unknown[]) : []
        stats.products = prodsArr.length
        recentProducts = prodsArr.slice(0, 5).map((p) => {
          const rec = p as Record<string, unknown>
          return { id: String(rec.id ?? ''), title: String(rec.title ?? ''), createdAt: (rec.createdAt ? String(rec.createdAt) : undefined) }
        })
      } catch { /* ignore */ }
    }
  } catch (err) {
    // swallow and render empty placeholders
    void err
  }

  // Normalize product titles for a nicer admin display. Titles may be stored
  // as plain strings, localization objects, or JSON-encoded strings.
  const formatDate = (iso?: string | null) => {
    try {
      if (!iso) return undefined
      const d = new Date(iso)
      if (Number.isNaN(d.getTime())) return undefined
      const pad = (n: number) => String(n).padStart(2, '0')
      const day = pad(d.getDate())
      const month = pad(d.getMonth() + 1)
      const year = d.getFullYear()
      const hours = pad(d.getHours())
      const mins = pad(d.getMinutes())
      const secs = pad(d.getSeconds())
      return `${day}.${month}.${year} ${hours}:${mins}:${secs}`
    } catch {
      return undefined
    }
  }
  const parseDisplayTitle = (raw: unknown) => {
    try {
      if (!raw && raw !== 0) return ''
      // If it's already an object with i18n keys
      if (typeof raw === 'object') {
        const o = raw as Record<string, unknown>
        // prefer Turkish if available
        if (typeof o.tr === 'string' && o.tr.trim()) return o.tr
        // otherwise first non-empty value
        for (const v of Object.values(o)) if (typeof v === 'string' && v.trim()) return v
        return JSON.stringify(raw)
      }
      if (typeof raw === 'string') {
        const s = raw.trim()
        if (!s) return ''
        // Try to parse JSON strings which may contain objects
        try {
          const parsed = JSON.parse(s)
          return parseDisplayTitle(parsed)
        } catch {
          // not JSON — return as-is
          return s
        }
      }
      return String(raw)
    } catch {
      return ''
    }
  }

  recentProducts = recentProducts.map((p) => ({ ...p, title: parseDisplayTitle(p.title) }))

  // Format createdAt timestamps into a deterministic, locale-independent
  // string on the server to avoid hydration mismatches caused by
  // Date.toLocaleString differences between server and client.
  recentMessages = recentMessages.map((m) => ({ ...m, createdAt: formatDate(m.createdAt ?? undefined) }))
  recentProducts = recentProducts.map((p) => ({ ...p, createdAt: formatDate(p.createdAt ?? undefined) }))

  return { props: { stats, recentMessages, recentProducts } }
}
