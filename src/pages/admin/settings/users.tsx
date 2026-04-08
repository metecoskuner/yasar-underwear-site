import AdminLayout from '@/components/admin/AdminLayout'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { isAuthed } from '@/lib/adminAuth'
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

type Props = { adminUser: string | null; savingDisabled: boolean }

export default function UsersPage({ adminUser, savingDisabled }: Props) {
  const { t } = useLanguage()
  const tr = (key: string, fallback: string) => {
    try {
      const value = t(key)
      return value === key ? fallback : String(value)
    } catch {
      return fallback
    }
  }
  const [newPass, setNewPass] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function savePassword() {
    setMessage(null)
    if (!newPass) return setMessage(tr('admin.users.validation.emptyPassword', 'Yeni parola boş olamaz.'))
    if (newPass !== confirm) return setMessage(tr('admin.users.validation.mismatch', 'Parolalar eşleşmiyor.'))
    setLoading(true)
    try {
      // Best-effort: try to save to settings file. Note: login is env-backed (ADMIN_PASS) so
      // changing the settings file may not affect authentication until the app is reconfigured.
      const res = await fetch('/api/admin/save-settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ settings: { users: [], site: {}, admin: { pass: newPass } } }), credentials: 'same-origin' })
      if (!res.ok) {
        const j = await res.json().catch(() => null)
        if (res.status === 501) {
          setMessage(tr('admin.users.messages.disabled', 'Bu dağıtımda parola değişikliği devre dışı. Lütfen ADMIN_PASS ortam değişkenini güncelleyin.'))
        } else {
          setMessage((j && j.message) ? String(j.message) : tr('admin.users.messages.saveError', 'Kaydetme sırasında hata oluştu.'))
        }
      } else {
        setMessage(tr('admin.users.messages.saved', 'Parola kaydedildi (uygulamayı yeniden başlatmanız gerekebilir).'))
        setNewPass('')
        setConfirm('')
      }
    } catch (err) {
      void err
      setMessage(tr('admin.users.messages.requestFailed', 'Kaydetme isteği başarısız oldu.'))
    } finally { setLoading(false) }
  }

  return (
    <AdminLayout>
      <Head><title>{tr('admin.users.metaTitle', 'Admin - Kullanıcılar')}</title></Head>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-3">{tr('admin.users.title', 'Kullanıcılar')}</h1>
        <p className="text-sm text-gray-600 mb-4">{tr('admin.users.lead', 'Bu panel artık sadece yönetici parolasını değiştirmek için kullanılmaktadır.')}</p>

        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">{tr('admin.users.adminUser', 'Yönetici Kullanıcı')}</label>
          <div className="px-3 py-2 bg-gray-50 border rounded">{adminUser || tr('admin.users.defaultAdmin', 'admin')}</div>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">{tr('admin.users.newPassword', 'Yeni Parola')}</label>
          <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">{tr('admin.users.confirmPassword', 'Parolayı Onayla')}</label>
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>

        <div className="flex items-center gap-3">
          <button onClick={savePassword} className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? tr('admin.users.saving', 'Kaydediliyor...') : tr('admin.users.savePassword', 'Parolayı Kaydet')}</button>
          {savingDisabled && <div className="text-sm text-yellow-600">{tr('admin.users.warning', 'Uyarı: Bu ortamda ayar kaydetme devre dışı. Ortam değişkenini güncelleyin.')}</div>}
        </div>

        {message && <div className="mt-4 text-sm text-gray-700">{message}</div>}

        <div className="mt-6 text-sm text-gray-500">
          {tr('admin.users.noteIntro', 'Not: Bu proje varsayılan olarak yönetici kimlik bilgilerini')} <code className="bg-gray-100 px-1 py-0.5 rounded">ADMIN_USER</code> ve <code className="bg-gray-100 px-1 py-0.5 rounded">ADMIN_PASS</code> {tr('admin.users.noteOutro', 'ortam değişkenlerinden okur. Üretimde parola değişikliği için lütfen dağıtımınızın ortam ayarlarını kullanın.')}
        </div>
      </div>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try { const authed = isAuthed(context.req); if (!authed) return { redirect: { destination: '/admin', permanent: false } } } catch (err) { void err; return { redirect: { destination: '/admin', permanent: false } } }
  const adminUser = process.env.ADMIN_USER || 'admin'
  // savingDisabled previously prevented file writes when DATABASE_URL was set.
  // With DB support for admin credentials we enable saving when DATABASE_URL is present.
  const savingDisabled = false
  return { props: { adminUser, savingDisabled } }
}
