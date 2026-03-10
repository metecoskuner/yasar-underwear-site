import Link from 'next/link'
import { useEffect, useState } from 'react'

function Badge({ count }: { count: number }) {
  if (!count) return null
  return <span className="inline-flex items-center justify-center ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-red-600 text-white">{count}</span>
}

export default function AdminSidebar() {
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
    return () => { mounted = false; clearInterval(iv) }
  }, [])

  

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <Link href="/" className="text-lg font-bold text-gray-800 hover:text-blue-700 transition-colors">Yasar</Link>
      </div>

      <nav className="space-y-1" aria-label="Yönetici navigasyonu">
  <Link href="/admin/overview" className="block px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-700 text-sm font-medium text-gray-700 cursor-pointer transition-colors">Genel Bakış</Link>
  <Link href="/admin/content" className="block px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-700 text-sm font-medium text-gray-700 cursor-pointer transition-colors">İçerik</Link>
        <Link href="/admin/messages" className="flex items-center px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-700 text-sm font-medium text-gray-700 cursor-pointer transition-colors">
          <span>Gelen Mesajlar</span>
          <Badge count={unread} />
        </Link>
        <Link href="/admin/applications/private-label" className="flex items-center px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-700 text-sm font-medium text-gray-700 cursor-pointer transition-colors">
          <span>Özel Marka Başvuruları</span>
          <Badge count={unreadPrivate} />
        </Link>
        <Link href="/admin/applications/wholesale" className="flex items-center px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-700 text-sm font-medium text-gray-700 cursor-pointer transition-colors">
          <span>Toptan Başvuruları</span>
          <Badge count={unreadWholesale} />
        </Link>
        <Link href="/admin" className="block px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-700 text-sm font-medium text-gray-700 cursor-pointer transition-colors">Giriş</Link>
      </nav>
    </div>
  )
}
