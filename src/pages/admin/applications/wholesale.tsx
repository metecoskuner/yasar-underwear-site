import AdminLayout from '@/components/admin/AdminLayout'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { isAuthed } from '@/lib/adminAuth'
import ApplicationsList from '@/components/admin/ApplicationsList'

export default function WholesaleApplicationsPage() {
  return (
    <AdminLayout>
      <Head>
        <title>Admin - Toptan Başvuruları</title>
      </Head>
      <div className="max-w-7xl mx-auto p-6">
        <ApplicationsList initialFilter="wholesale" />
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
