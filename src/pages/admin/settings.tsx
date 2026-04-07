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

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h1 className="mb-3 text-2xl font-semibold text-slate-900">Ayarlar</h1>
        <p className="mb-5 max-w-2xl text-sm leading-6 text-slate-600">Yönetici erişimi ve panelin temel davranışlarını buradan yönetebilirsin.</p>

        <section className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Link href="/admin/settings/users" className="block rounded-2xl border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:shadow-md">
              <h3 className="font-medium text-slate-900">Kullanıcılar</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">Yönetici kullanıcıları görüntüle ve giriş ayarlarını kontrol et.</p>
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
