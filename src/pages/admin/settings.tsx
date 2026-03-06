import AdminLayout from '@/components/admin/AdminLayout'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { isAuthed } from '@/lib/adminAuth'

export default function SettingsPage() {

  return (
    <AdminLayout>
      <Head>
        <title>Yönetici - Ayarlar</title>
      </Head>

      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-3">Ayarlar</h1>
        <p className="text-sm text-gray-600 mb-4">Kullanıcı yönetimi, global site ayarları ve diğer konfigürasyonlar buradan yapılacak.</p>

        <section className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/admin/settings/users" className="block p-4 border rounded hover:shadow-md transition">
              <h3 className="font-medium">Kullanıcılar</h3>
              <p className="text-sm text-gray-500">Yönetici kullanıcıları görüntüle ve yetki ayarları.</p>
            </Link>
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
  return { props: {} }
}
