import AdminLayout from '@/components/admin/AdminLayout'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { isAuthed } from '@/lib/adminAuth'

export default function OverviewPage() {
  return (
    <AdminLayout>
      <Head>
        <title>Yönetici - Genel Bakış</title>
      </Head>

      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-3">Genel Bakış</h1>
        <p className="text-sm text-gray-600 mb-4">Burada kısa istatistikler, son aktiviteler ve anlık metriklere hızlı bağlantılar gösterilecek.</p>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded">
            <h3 className="font-medium">Son Düzenlemeler</h3>
            <p className="text-sm text-gray-500">En son düzenlenen sayfalar burada listelenecek.</p>
          </div>
          <div className="p-4 border rounded">
            <h3 className="font-medium">Hızlı İstatistikler</h3>
            <p className="text-sm text-gray-500">Sayfa görünümleri, form gönderimleri ve benzeri kısa metrikler.</p>
          </div>
        </section>
      </div>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const authed = isAuthed(context.req)
    if (!authed) return { redirect: { destination: '/admin', permanent: false } }
  } catch (err) { void err; return { redirect: { destination: '/admin', permanent: false } } }
  return { props: {} }
}
