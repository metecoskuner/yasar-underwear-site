import { useRouter } from 'next/router'

export default function AdminTopbar({ onToggle, mobileOpen }: { onToggle?: () => void; mobileOpen?: boolean }) {
  const router = useRouter()

  const routeTitles: Record<string, string> = {
    '/admin/overview': 'Genel Bakış',
    '/admin/dashboard': 'Genel Bakış',
    '/admin/content': 'İçerik Yönetimi',
    '/admin/media': 'Medya',
    '/admin/messages': 'Gelen Mesajlar',
    '/admin/applications': 'Başvurular',
    '/admin/applications/private-label': 'Özel Marka Başvuruları',
    '/admin/applications/wholesale': 'Toptan Başvuruları',
    '/admin/settings': 'Ayarlar',
    '/admin/settings/site': 'Site Ayarları',
    '/admin/settings/users': 'Kullanıcılar',
    '/admin/hero': 'Hero Yönetimi',
    '/admin/honeypot': 'Honeypot Kayıtları',
  }

  const currentTitle = routeTitles[router.pathname] || 'Yönetici'

  async function doLogout() {
    try {
      await fetch('/api/admin/logout', { credentials: 'include' })
    } catch {}
    router.push('/admin')
  }

  function goBack() {
    try {
      // prefer a real history.back when possible, otherwise fallback to dashboard
      if (typeof window !== 'undefined' && window.history && window.history.length > 1) {
        router.back()
      } else {
        router.push('/admin/overview')
      }
    } catch (err) {
      void err
      router.push('/admin/overview')
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:px-5 lg:px-8">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            onClick={onToggle}
            aria-expanded={mobileOpen}
            aria-label="Aç/Kapat menü"
            className="lg:hidden rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {mobileOpen ? 'Kapat' : 'Menü'}
          </button>
          <button
            onClick={goBack}
            aria-label="Geri"
            title="Geri"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Geri
          </button>
          <div className="min-w-0">
            <div className="truncate text-base font-semibold text-slate-900 sm:text-lg">{currentTitle}</div>
            <div className="hidden text-xs text-slate-500 sm:block">Yasar Tekstil yönetim alanı</div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 sm:block">
            Güvenli Oturum
          </div>
          <button
            onClick={doLogout}
            className="rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-200"
          >
            Çıkış
          </button>
        </div>
      </div>
    </header>
  )
}
