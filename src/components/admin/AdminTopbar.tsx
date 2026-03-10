import { useRouter } from 'next/router'

export default function AdminTopbar({ onToggle, mobileOpen }: { onToggle?: () => void; mobileOpen?: boolean }) {
  const router = useRouter()

  async function doLogout() {
    try {
      await fetch('/api/admin/logout')
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
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
          <button onClick={goBack} aria-label="Geri" title="Geri" className="px-2 py-1 rounded bg-gray-100 text-sm hover:bg-gray-200 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400">Geri</button>
              <button onClick={onToggle} aria-expanded={mobileOpen} aria-label="Aç/Kapat menü" className="lg:hidden px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400">{mobileOpen ? 'Kapat' : 'Menü'}</button>
              <h2 className="text-lg font-semibold">Yönetici</h2>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={doLogout} className="text-sm text-red-600 hover:text-red-700 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-200">Çıkış</button>
        </div>
      </div>
    </header>
  )
}
