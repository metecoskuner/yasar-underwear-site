import AdminLayout from '@/components/admin/AdminLayout'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { isAuthed } from '@/lib/adminAuth'

export default function OffersPageRemoved() {
  return (
    <AdminLayout>
      <Head>
        <title>Admin - Gelen Teklifler (Kaldırıldı)</title>
      </Head>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-3">Gelen Teklifler</h1>
        <div className="text-sm text-gray-600">Teklif/quote özelliği sistemden kaldırıldı. Bu sayfa artık kullanılamıyor.</div>
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
