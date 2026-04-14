import AdminLayout from '@/components/admin/AdminLayout'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { isAuthed } from '@/lib/adminAuth'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
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

type RawRecord = Record<string, unknown>
type OverviewMessage = { id: string; from?: string; read?: unknown; createdAt?: string }
type OverviewApplication = { id: string; type?: string; payload?: RawRecord; read?: unknown; createdAt?: string }
type OverviewProduct = { id: string; title?: string; createdAt?: string }

const DATA_DIR = path.join(process.cwd(), 'data')

function isRead(value: unknown) {
  return value === true || value === 'true' || value === 1 || value === '1'
}

function readJsonArray<T extends RawRecord>(filename: string, key?: string): T[] {
  try {
    const raw = fs.readFileSync(path.join(DATA_DIR, filename), 'utf-8')
    const parsed = JSON.parse(raw) as unknown
    if (!key) return Array.isArray(parsed) ? (parsed as T[]) : []
    if (parsed && typeof parsed === 'object' && Array.isArray((parsed as Record<string, unknown>)[key])) {
      return (parsed as Record<string, unknown>)[key] as T[]
    }
  } catch {
    return []
  }
  return []
}

function mergeById<T extends { id: string }>(primary: T[], secondary: T[]) {
  const map = new Map<string, T>()
  for (const item of secondary) map.set(item.id, item)
  for (const item of primary) map.set(item.id, item)
  return Array.from(map.values())
}

function sortByCreatedAtDesc<T extends { createdAt?: string }>(items: T[]) {
  return [...items].sort((a, b) => new Date(String(b.createdAt ?? '')).valueOf() - new Date(String(a.createdAt ?? '')).valueOf())
}

function mapFileMessage(message: RawRecord): OverviewMessage {
  return {
    id: String(message.id ?? `file-${message.createdAt ?? Date.now()}`),
    from: String(message.name ?? message.from ?? 'Anonim'),
    read: message.read,
    createdAt: typeof message.createdAt === 'string' ? message.createdAt : new Date().toISOString(),
  }
}

function mapDbMessage(message: RawRecord): OverviewMessage {
  return {
    id: String(message.id ?? ''),
    from: String(message.name ?? 'Anonim'),
    read: message.read,
    createdAt: typeof message.createdAt === 'string' ? message.createdAt : new Date(message.createdAt as Date).toISOString(),
  }
}

function mapFileApplication(app: RawRecord): OverviewApplication {
  return {
    id: String(app.id ?? `file-${app.createdAt ?? Date.now()}`),
    type: String(app.type ?? ''),
    payload: (app.payload && typeof app.payload === 'object') ? app.payload as RawRecord : {},
    read: app.read,
    createdAt: typeof app.createdAt === 'string' ? app.createdAt : new Date().toISOString(),
  }
}

function mapDbApplication(app: RawRecord): OverviewApplication {
  return {
    id: String(app.id ?? ''),
    type: String(app.type ?? ''),
    payload: (app.payload && typeof app.payload === 'object') ? app.payload as RawRecord : {},
    read: app.read,
    createdAt: typeof app.createdAt === 'string' ? app.createdAt : new Date(app.createdAt as Date).toISOString(),
  }
}

function mapFileProduct(product: RawRecord): OverviewProduct {
  return {
    id: String(product.id ?? ''),
    title: parseDisplayTitle(product.title),
    createdAt: product.createdAt ? String(product.createdAt) : undefined,
  }
}

function parseDisplayTitle(raw: unknown) {
  try {
    if (!raw && raw !== 0) return ''
    if (typeof raw === 'object') {
      const obj = raw as Record<string, unknown>
      if (typeof obj.tr === 'string' && obj.tr.trim()) return obj.tr
      for (const value of Object.values(obj)) {
        if (typeof value === 'string' && value.trim()) return value
      }
      return JSON.stringify(raw)
    }
    if (typeof raw === 'string') {
      const trimmed = raw.trim()
      if (!trimmed) return ''
      try {
        return parseDisplayTitle(JSON.parse(trimmed))
      } catch {
        return trimmed
      }
    }
    return String(raw)
  } catch {
    return ''
  }
}

function formatDate(iso?: string | null) {
  try {
    if (!iso) return undefined
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return undefined
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  } catch {
    return undefined
  }
}

function companyFromPayload(payload?: RawRecord) {
  return String(payload?.companyName ?? payload?.company ?? '').trim() || '—'
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
    const fileMessages = readJsonArray<RawRecord>('admin-messages.json', 'messages').map(mapFileMessage)
    const fileApplications = readJsonArray<RawRecord>('admin-applications.json', 'applications').map(mapFileApplication)
    const fileProducts = readJsonArray<RawRecord>('products.json').map(mapFileProduct)

    let resolvedMessages = fileMessages
    let resolvedApplications = fileApplications
    let resolvedProducts = fileProducts

    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      try {
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
        const [{ data: dbMessages, error: messagesError }, { data: dbApplications, error: applicationsError }] = await Promise.all([
          supabase.from('ContactMessage').select('*').order('createdAt', { ascending: false }),
          supabase.from('B2BApplication').select('*').order('createdAt', { ascending: false }),
        ])
        if (messagesError) throw messagesError
        if (applicationsError) throw applicationsError

        resolvedMessages = sortByCreatedAtDesc(mergeById((dbMessages || []).map((message) => mapDbMessage(message as RawRecord)), fileMessages))
        resolvedApplications = sortByCreatedAtDesc(mergeById((dbApplications || []).map((app) => mapDbApplication(app as RawRecord)), fileApplications))
        try {
          if (process.env.DATABASE_URL) {
            const { prisma } = await import('@/lib/prisma')
            const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' }, take: 5 })
            stats.products = await prisma.product.count()
            resolvedProducts = products.map((product) => ({ id: String(product.id), title: product.title, createdAt: product.createdAt?.toISOString() ?? undefined }))
          }
        } catch {
          resolvedProducts = fileProducts
        }
      } catch (err) {
        void err
      }
    } else if (process.env.DATABASE_URL) {
      try {
        const { prisma } = await import('@/lib/prisma')
        const [msgs, apps, products] = await Promise.all([
          prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } }),
          prisma.b2BApplication.findMany({ orderBy: { createdAt: 'desc' } }),
          prisma.product.findMany({ orderBy: { createdAt: 'desc' } }),
        ])
        resolvedMessages = sortByCreatedAtDesc(mergeById(msgs.map((message) => mapDbMessage(message as unknown as RawRecord)), fileMessages))
        resolvedApplications = sortByCreatedAtDesc(mergeById(apps.map((app) => mapDbApplication(app as unknown as RawRecord)), fileApplications))
        resolvedProducts = products.map((product) => ({ id: String(product.id), title: product.title, createdAt: product.createdAt?.toISOString() ?? undefined }))
      } catch (err) {
        void err
      }
    }

    const orderedMessages = sortByCreatedAtDesc(resolvedMessages)
    const orderedApplications = sortByCreatedAtDesc(resolvedApplications)
    const orderedProducts = sortByCreatedAtDesc(resolvedProducts)

    stats.messages = orderedMessages.length
    stats.unreadMessages = orderedMessages.filter((message) => !isRead(message.read)).length
    stats.wholesaleApplications = orderedApplications.filter((app) => app.type === 'wholesale').length
    stats.privateLabelApplications = orderedApplications.filter((app) => app.type === 'private-label').length
    stats.unreadWholesaleApplications = orderedApplications.filter((app) => app.type === 'wholesale' && !isRead(app.read)).length
    stats.unreadPrivateLabelApplications = orderedApplications.filter((app) => app.type === 'private-label' && !isRead(app.read)).length
    stats.products = orderedProducts.length

    recentMessages = orderedMessages.slice(0, 5).map((message) => ({
      id: message.id,
      from: message.from,
      createdAt: message.createdAt,
    }))
    recentApplications = orderedApplications.slice(0, 5).map((app) => ({
      id: app.id,
      type: app.type || undefined,
      company: companyFromPayload(app.payload),
      createdAt: app.createdAt,
    }))
    recentProducts = orderedProducts.slice(0, 5).map((product) => ({
      id: product.id,
      title: product.title,
      createdAt: product.createdAt,
    }))
  } catch (err) {
    // swallow and render empty placeholders
    void err
  }

  recentProducts = recentProducts.map((p) => ({ ...p, title: parseDisplayTitle(p.title) }))
  recentMessages = recentMessages.map((m) => ({ ...m, createdAt: formatDate(m.createdAt ?? undefined) }))
  recentApplications = recentApplications.map((app) => ({ ...app, createdAt: formatDate(app.createdAt ?? undefined) }))
  recentProducts = recentProducts.map((p) => ({ ...p, createdAt: formatDate(p.createdAt ?? undefined) }))

  return { props: { stats, recentMessages, recentApplications, recentProducts } }
}
