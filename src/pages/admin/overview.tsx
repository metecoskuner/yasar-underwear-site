import AdminLayout from '@/components/admin/AdminLayout'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { isAuthed } from '@/lib/adminAuth'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
// prisma client is imported lazily inside getServerSideProps to avoid
// module-load failures in serverless/CI environments where the native
// prisma engine may not be available at import time.

type OverviewProps = {
  stats: {
    messages: number
    unreadMessages?: number
    products: number
    wholesaleApplications: number
    privateLabelApplications: number
    unreadWholesaleApplications: number
    unreadPrivateLabelApplications: number
  }
  recentMessages: Array<{ id: string; from?: string; createdAt?: string }>
  recentApplications: Array<{ id: string; type?: string; company?: string; createdAt?: string }>
  recentProducts: Array<{ id: string; title?: string; createdAt?: string }>
}

export default function OverviewPage({ stats, recentMessages, recentApplications, recentProducts }: OverviewProps) {
  const totalApplications = stats.wholesaleApplications + stats.privateLabelApplications
  const totalUnreadApplications = stats.unreadWholesaleApplications + stats.unreadPrivateLabelApplications

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

        <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col rounded-2xl bg-white p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-500">Mesajlar</div>
            <div className="mt-3 text-3xl font-extrabold text-gray-800">{stats.messages}</div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Okunmamış</span>
                <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">{stats.unreadMessages ?? 0}</span>
              </div>
              <span className="text-gray-300">/</span>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Toplam</span>
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-800">{stats.messages}</span>
              </div>
            </div>
            <Link href="/admin/messages" className="mt-4 text-sm font-medium text-blue-700 hover:text-blue-800">
              Mesajları aç
            </Link>
          </div>
          <div className="flex flex-col rounded-2xl bg-white p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-500">Başvurular</div>
            <div className="mt-3 text-3xl font-extrabold text-gray-800">{totalApplications}</div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">Toptan {stats.wholesaleApplications}</span>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">Private Label {stats.privateLabelApplications}</span>
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">Okunmamış {totalUnreadApplications}</span>
            </div>
            <Link href="/admin/applications" className="mt-4 text-sm font-medium text-blue-700 hover:text-blue-800">
              Başvuruları aç
            </Link>
          </div>
          <div className="flex flex-col rounded-2xl bg-white p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-500">Ürünler</div>
            <div className="mt-3 text-3xl font-extrabold text-gray-800">{stats.products}</div>
            <div className="mt-2 text-sm text-gray-400">Katalogta kayıtlı ürün sayısı</div>
            <Link href="/admin/content" className="mt-4 text-sm font-medium text-blue-700 hover:text-blue-800">
              İçeriği düzenle
            </Link>
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
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <h3 className="font-medium text-gray-800">Son Başvurular</h3>
            <ul className="mt-3 space-y-3 text-sm text-gray-600">
              {recentApplications.length === 0 ? <li className="text-gray-400">Başvuru bulunamadı.</li> : recentApplications.map((app) => (
                <li key={app.id} className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-800">{app.company || '—'}</div>
                    <div className="mt-1 text-xs uppercase tracking-wide text-gray-500">{app.type === 'private-label' ? 'Private Label' : 'Wholesale'}</div>
                  </div>
                  <div className="shrink-0 text-xs text-gray-400">{app.createdAt ?? ''}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
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
                    <div className="mt-1 text-xs text-gray-400">{p.createdAt ?? ''}</div>
                  </div>
                  <div className={`flex h-9 w-14 shrink-0 items-center justify-center rounded-full text-xs text-white sm:ml-4 ${['bg-indigo-500','bg-pink-500','bg-yellow-500','bg-green-500','bg-sky-500'][i % 5]}`}>
                    Yeni
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">Hızlı Erişim</h3>
            <div className="mt-4 grid gap-3">
              <Link href="/admin/messages" className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                Gelen Mesajlar
              </Link>
              <Link href="/admin/applications/private-label" className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                Özel Marka Başvuruları
              </Link>
              <Link href="/admin/applications/wholesale" className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                Toptan Başvuruları
              </Link>
              <Link href="/admin/content" className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                İçerik Yönetimi
              </Link>
            </div>
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
  let stats = {
    messages: 0,
    unreadMessages: 0,
    products: 0,
    wholesaleApplications: 0,
    privateLabelApplications: 0,
    unreadWholesaleApplications: 0,
    unreadPrivateLabelApplications: 0,
  }
  let recentMessages: Array<{ id: string; from?: string; createdAt?: string }> = []
  let recentApplications: Array<{ id: string; type?: string; company?: string; createdAt?: string }> = []
  let recentProducts: Array<{ id: string; title?: string; createdAt?: string }> = []

  try {
    let dbLoaded = false
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
        const [
          wholesaleApplications,
          privateLabelApplications,
          unreadWholesaleApplications,
          unreadPrivateLabelApplications,
        ] = await Promise.all([
          prisma.b2BApplication.count({ where: { type: 'wholesale' } }),
          prisma.b2BApplication.count({ where: { type: 'private-label' } }),
          prisma.b2BApplication.count({ where: { type: 'wholesale', read: false } }),
          prisma.b2BApplication.count({ where: { type: 'private-label', read: false } }),
        ])

        stats = {
          messages: messagesCount,
          unreadMessages: unreadCount,
          products: productsCount,
          wholesaleApplications,
          privateLabelApplications,
          unreadWholesaleApplications,
          unreadPrivateLabelApplications,
        }

        const [msgs, apps, products] = await Promise.all([
          prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
          prisma.b2BApplication.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
          prisma.product.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
        ])
        recentMessages = msgs.map((m) => ({ id: m.id, from: m.name || 'Anonim', createdAt: m.createdAt?.toISOString() }))
        recentApplications = apps.map((app) => {
          const payload = (app.payload && typeof app.payload === 'object') ? app.payload as Record<string, unknown> : {}
          return {
            id: app.id,
            type: app.type ?? undefined,
            company: String(payload.companyName ?? payload.company ?? '').trim() || '—',
            createdAt: app.createdAt?.toISOString(),
          }
        })
        recentProducts = products.map((p) => ({ id: String(p.id), title: (typeof p.title === 'string' ? p.title : JSON.stringify(p.title)) || '', createdAt: p.createdAt?.toISOString() ?? undefined }))
        dbLoaded = true
      } catch (err) {
        // If DB access or prisma import fails in the build environment,
        // swallow and fall back to file-based data below.
        void err
      }
    }

    if (!dbLoaded) {
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

      try {
        const appsRaw = fs.readFileSync(path.join(base, 'data', 'admin-applications.json'), 'utf-8')
        const parsed = JSON.parse(appsRaw) as { applications?: unknown }
        const appsArr = Array.isArray(parsed.applications) ? (parsed.applications as unknown[]) : []
        const isRead = (v: unknown) => v === true || v === 'true' || v === 1 || v === '1'
        stats.wholesaleApplications = appsArr.filter((app) => String((app as Record<string, unknown>).type ?? '') === 'wholesale').length
        stats.privateLabelApplications = appsArr.filter((app) => String((app as Record<string, unknown>).type ?? '') === 'private-label').length
        stats.unreadWholesaleApplications = appsArr.filter((app) => String((app as Record<string, unknown>).type ?? '') === 'wholesale' && !isRead((app as Record<string, unknown>).read)).length
        stats.unreadPrivateLabelApplications = appsArr.filter((app) => String((app as Record<string, unknown>).type ?? '') === 'private-label' && !isRead((app as Record<string, unknown>).read)).length
        recentApplications = appsArr.slice(0, 5).map((app) => {
          const rec = app as Record<string, unknown>
          const payload = (rec.payload && typeof rec.payload === 'object') ? rec.payload as Record<string, unknown> : {}
          return {
            id: String(rec.id ?? Date.now()),
            type: String(rec.type ?? ''),
            company: String(payload.companyName ?? payload.company ?? '').trim() || '—',
            createdAt: rec.createdAt ? String(rec.createdAt) : undefined,
          }
        })
      } catch { /* ignore */ }

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
  recentApplications = recentApplications.map((app) => ({ ...app, createdAt: formatDate(app.createdAt ?? undefined) }))
  recentProducts = recentProducts.map((p) => ({ ...p, createdAt: formatDate(p.createdAt ?? undefined) }))

  return { props: { stats, recentMessages, recentApplications, recentProducts } }
}
