import type { GetServerSideProps } from 'next'
import { isAuthed } from '@/lib/adminAuth'

// Hero admin page removed. Redirect to admin overview.
export default function RemovedHeroPage() {
  return null
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const authed = await isAuthed(context.req)
    if (!authed) return { redirect: { destination: '/admin', permanent: false } }
  } catch (err) {
    void err
    return { redirect: { destination: '/admin', permanent: false } }
  }
  return { redirect: { destination: '/admin/overview', permanent: false } }
}
