import { useEffect, useState } from 'react'
import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import { isAuthed } from '@/lib/adminAuth'

export default function AdminPage() {
  // router not needed here; simple login page that redirects via full nav
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    // safer auth probe using a GET status endpoint
    fetch('/api/admin/status', { method: 'GET' })
      .then((r) => {
        if (r.status === 401) setAuthed(false)
        else setAuthed(true)
      })
      .catch(() => setAuthed(false))
  }, [])

  async function doLogin(e?: React.FormEvent) {
    if (e) e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/login', { method: 'POST', body: JSON.stringify({ user, pass }), headers: { 'Content-Type': 'application/json' } })
      const j = await res.json()
      if (res.ok && j.ok) {
        setAuthed(true)
        setMessage('Giriş başarılı')
        // use full navigation to ensure cookie is applied and SSR pages see it
        window.location.href = '/admin/dashboard'
      } else {
        setMessage('Giriş başarısız')
      }
    } catch (err) {
      void err
      setMessage('Ağ hatası')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Head>
        <title>Admin - Yasar</title>
      </Head>
      <div className="max-w-4xl mx-auto bg-white shadow p-6 rounded">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Yönetici Paneli</h1>
        </header>

        {authed === false && (
          <div>
            <p className="mb-3 text-sm text-gray-600">Lütfen yönetici kullanıcı adı ve şifrenizi girin.</p>
            <form onSubmit={doLogin} className="space-y-2">
              <input className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="Kullanıcı" value={user} onChange={(e) => setUser(e.target.value)} />
              <input className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="Şifre" value={pass} onChange={(e) => setPass(e.target.value)} type="password" />
              <div className="flex items-center space-x-2">
                <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition cursor-pointer" disabled={loading} type="submit">Giriş</button>
                <button type="button" className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer" onClick={() => { setUser(''); setPass(''); }}>Temizle</button>
              </div>
              {message && <div className="text-sm text-red-600">{message}</div>}
            </form>
          </div>
        )}

        {authed === true && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Giriş başarılı. Yönlendiriliyorsunuz...</p>
          </div>
        )}

        {authed === null && <div className="text-sm text-gray-500">Durum kontrol ediliyor...</div>}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const authed = isAuthed(context.req)
    if (authed) {
      return { redirect: { destination: '/admin/dashboard', permanent: false } }
    }
  } catch (err) {
    void err
  }
  return { props: {} }
}
