import AdminLayout from '@/components/admin/AdminLayout'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { isAuthed } from '@/lib/adminAuth'
import ApplicationsList from '@/components/admin/ApplicationsList'
import { useRouter } from 'next/router'

export default function ApplicationsPage() {
  const router = useRouter()
  const q = router.query.filter || router.query.type
  const initial = q ? String(q) : 'all'

  return (
    <AdminLayout>
      <Head>
        <title>Admin - Başvurular</title>
      </Head>

      <div className="max-w-7xl mx-auto p-6">
        <ApplicationsList initialFilter={initial} />
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
