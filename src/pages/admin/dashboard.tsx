import AdminLayout from '@/components/admin/AdminLayout'
import Head from 'next/head'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { isAuthed } from '@/lib/adminAuth'

export default function DashboardPage() {
  return (
    <AdminLayout>
      <Head>
        <title>Yönetici - Pano</title>
      </Head>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <Link href="/admin/overview" className="block p-4 bg-white rounded shadow hover:shadow-lg hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
          <h3 className="text-sm font-medium">Genel Bakış</h3>
          <p className="mt-2 text-sm text-gray-600">Kısa özet ve hızlı istatistikler buraya gelecek.</p>
        </Link>

  <Link href="/admin/content" className="block p-4 bg-white rounded shadow hover:shadow-lg hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
          <h3 className="text-sm font-medium">İçerik</h3>
          <p className="mt-2 text-sm text-gray-600">Yönetici içerik düzenleme bağlantıları.</p>
        </Link>

  <Link href="/admin/settings" className="block p-4 bg-white rounded shadow hover:shadow-lg hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
          <h3 className="text-sm font-medium">Ayarlar</h3>
          <p className="mt-2 text-sm text-gray-600">Hızlı ayarlar ve kullanıcı yönetimi.</p>
        </Link>
      </div>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
      const authed = await isAuthed(context.req)
    if (!authed) {
      return {
        redirect: {
          destination: '/admin',
          permanent: false,
        },
      }
    }
  } catch (err) {
    void err
    return { redirect: { destination: '/admin', permanent: false } }
  }
  return { props: {} }
}
