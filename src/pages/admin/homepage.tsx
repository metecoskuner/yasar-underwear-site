import { GetServerSideProps } from 'next'
import { isAuthed } from '@/lib/adminAuth'

export default function HomepageAdminRedirect() {
  // This page intentionally redirects to the main content management UI.
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
  return { redirect: { destination: '/admin/content', permanent: false } }
}

