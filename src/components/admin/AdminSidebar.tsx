import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function AdminSidebar() {
  const [unread, setUnread] = useState<number>(0)
  const [unhandled, setUnhandled] = useState<number>(0)

  useEffect(() => {
    let mounted = true
    async function loadCounts() {
      try {
        const [mResp, oResp] = await Promise.all([fetch('/api/admin/messages'), fetch('/api/admin/offers')])
        if (!mounted) return
        if (mResp.ok) {
          const m = await mResp.json()
          const msgs = m.messages || []
          setUnread(msgs.filter((x: any) => !x.read).length)
        }
        if (oResp.ok) {
          const o = await oResp.json()
          const offers = o.offers || []
          setUnhandled(offers.filter((x: any) => !x.handled).length)
        }
      } catch (err) {
        void err
      }
    }
    loadCounts()
    const iv = setInterval(loadCounts, 15000)
    return () => { mounted = false; clearInterval(iv) }
  }, [])

  function Badge({ count }: { count: number }) {
    if (!count) return null
    return <span className="inline-flex items-center justify-center ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-red-600 text-white">{count}</span>
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <Link href="/" className="text-lg font-bold text-gray-800 hover:text-blue-700 transition-colors">Yasar</Link>
      </div>

      <nav className="space-y-1" aria-label="Yönetici navigasyonu">
        <Link href="/admin/dashboard" className="block px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-700 text-sm font-medium text-gray-700 cursor-pointer transition-colors">Genel Bakış</Link>
        <Link href="/admin/content" className="block px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-700 text-sm font-medium text-gray-700 cursor-pointer transition-colors">İçerik</Link>
        <Link href="/admin/offers" className="flex items-center px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-700 text-sm font-medium text-gray-700 cursor-pointer transition-colors">
          <span>Gelen Teklifler</span>
          <Badge count={unhandled} />
        </Link>
        <Link href="/admin/messages" className="flex items-center px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-700 text-sm font-medium text-gray-700 cursor-pointer transition-colors">
          <span>Gelen Mesajlar</span>
          <Badge count={unread} />
        </Link>
        <Link href="/admin" className="block px-3 py-2 rounded-md hover:bg-blue-50 hover:text-blue-700 text-sm font-medium text-gray-700 cursor-pointer transition-colors">Giriş</Link>
      </nav>
    </div>
  )
}
