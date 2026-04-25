import AdminLayout from '@/components/admin/AdminLayout'
import Head from 'next/head'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { isAuthed } from '@/lib/adminAuth'

export default function OffersPage() {
  return (
    <AdminLayout>
      <Head>
        <title>Admin - Gelen Bilgi Talepleri</title>
      </Head>
      <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-6">Gelen B2B Bilgi Talepleri</h1>
        <p className="text-gray-500 mb-4">B2B bilgi talepleri ContactMessage API&apos;sı aracılığıyla alınmaktadır.</p>
        <p className="text-sm text-gray-600">
          Bilgi talepleri hakkında daha fazla bilgi için <Link href="/admin/messages" className="text-blue-500 hover:underline">Mesajlar</Link> sayfasını ziyaret edin.
        </p>
      </div>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const authed = await isAuthed(context.req)
    if (!authed) return { redirect: { destination: '/admin', permanent: false } }
  } catch (err) {
    console.error('Auth error:', err)
    return { redirect: { destination: '/admin', permanent: false } }
  }
  return { props: {} }
}
