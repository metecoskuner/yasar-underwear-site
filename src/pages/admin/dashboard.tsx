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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Link href="/admin/overview" className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
          <h3 className="text-sm font-medium text-slate-900">Genel Bakış</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">Mesajlar, ürünler ve son aktiviteler için hızlı özet ekranı.</p>
        </Link>

        <Link href="/admin/content" className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
          <h3 className="text-sm font-medium text-slate-900">İçerik</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">Ana sayfa, ürünler ve görsel alanlar için içerik yönetimi.</p>
        </Link>

        <Link href="/admin/settings" className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
          <h3 className="text-sm font-medium text-slate-900">Ayarlar</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">Yönetici erişimi ve temel panel ayarları.</p>
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
