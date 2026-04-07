import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

function Badge({ count }: { count: number }) {
  if (!count) return null
  return <span className="inline-flex items-center justify-center ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-red-600 text-white">{count}</span>
}

type SidebarProps = {
  onNavigate?: () => void
}

type NavItem = {
  href: string
  label: string
  count?: number
  match?: string[]
}

export default function AdminSidebar({ onNavigate }: SidebarProps) {
  const router = useRouter()
  const [unread, setUnread] = useState<number>(0)
  const [unreadWholesale, setUnreadWholesale] = useState<number>(0)
  const [unreadPrivate, setUnreadPrivate] = useState<number>(0)

  useEffect(() => {
    let mounted = true
    async function loadCounts() {
      try {
        const mResp = await fetch('/api/admin/messages')
        if (!mounted) return
        if (mResp.ok) {
          const m = await mResp.json()
          const msgs = m.messages || []
          setUnread(msgs.filter((x: { read?: boolean }) => !x.read).length)
        }
        // applications - separate counts per type
        try {
          const aResp = await fetch('/api/admin/applications')
          if (!mounted) return
          if (aResp.ok) {
            const a = await aResp.json()
            const apps = a.applications || []
            setUnreadWholesale(apps.filter((x: { read?: boolean; type?: string }) => !x.read && x.type === 'wholesale').length)
            setUnreadPrivate(apps.filter((x: { read?: boolean; type?: string }) => !x.read && x.type === 'private-label').length)
          }
        } catch {}
      } catch (err) {
        void err
      }
    }
    loadCounts()
    const iv = setInterval(loadCounts, 15000)
    const onRefresh = () => { void loadCounts() }
    if (typeof window !== 'undefined') {
      window.addEventListener('admin-data-changed', onRefresh)
    }
    return () => {
      mounted = false
      clearInterval(iv)
      if (typeof window !== 'undefined') {
        window.removeEventListener('admin-data-changed', onRefresh)
      }
    }
  }, [])

  const items: NavItem[] = [
    { href: '/admin/overview', label: 'Genel Bakış', match: ['/admin/overview', '/admin/dashboard'] },
    { href: '/admin/content', label: 'İçerik', match: ['/admin/content', '/admin/hero', '/admin/media'] },
    { href: '/admin/messages', label: 'Gelen Mesajlar', count: unread },
    { href: '/admin/applications/private-label', label: 'Özel Marka Başvuruları', count: unreadPrivate, match: ['/admin/applications/private-label'] },
    { href: '/admin/applications/wholesale', label: 'Toptan Başvuruları', count: unreadWholesale, match: ['/admin/applications/wholesale'] },
    { href: '/admin/settings', label: 'Ayarlar', match: ['/admin/settings', '/admin/settings/site', '/admin/settings/users'] },
  ]

  const isActive = (item: NavItem) => {
    const matches = item.match || [item.href]
    return matches.some((entry) => router.pathname === entry || router.asPath.startsWith(`${entry}?`))
  }

  return (
    <div className="flex h-full flex-col p-4 sm:p-5">
      <div className="mb-6 border-b border-slate-200 pb-4">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Yasar Tekstil</div>
        <Link href="/" className="mt-2 block text-xl font-bold text-slate-900 hover:text-blue-700 transition-colors">
          Admin Panel
        </Link>
        <p className="mt-2 text-sm text-slate-500">İçerik, mesajlar ve başvurular için yönetim alanı.</p>
      </div>

      <nav className="space-y-1.5" aria-label="Yönetici navigasyonu">
        {items.map((item) => {
          const active = isActive(item)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                active
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              <span className="pr-3">{item.label}</span>
              <Badge count={item.count || 0} />
            </Link>
          )
        })}
      </nav>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <div className="font-semibold text-slate-800">Hızlı Not</div>
        <p className="mt-2 leading-6">Mobilde menü soldan açılır. Başlık çubuğu sabit kalır, içerik alanı taşmadan çalışır.</p>
      </div>

      <div className="mt-auto pt-6">
        <Link
          href="/admin"
          onClick={onNavigate}
          className="block rounded-xl border border-slate-200 px-3 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          Giriş Ekranı
        </Link>
      </div>
    </div>
  )
}
