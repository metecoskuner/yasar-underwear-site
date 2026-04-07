import React from 'react'
import FocusLock from 'react-focus-lock'
import { useRouter } from 'next/router'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'

type Props = {
  children: React.ReactNode
}

export default function AdminLayout({ children }: Props) {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const sidebarRef = React.useRef<HTMLDivElement | null>(null)
  const previouslyFocusedElement = React.useRef<Element | null>(null)
  
  React.useEffect(() => {
    if (!mobileOpen) return
    if (typeof document === 'undefined') return

    // Save previously focused element to restore focus on close
    previouslyFocusedElement.current = document.activeElement

    // Lock body scroll
    const body = document.body
    const prevOverflow = body.style.overflow
    body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)

    // Ensure sidebar container is focused so FocusLock can manage focus
    const container = sidebarRef.current
    setTimeout(() => {
      container?.focus()
    }, 0)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      body.style.overflow = prevOverflow || ''
      if (previouslyFocusedElement.current instanceof HTMLElement) {
        (previouslyFocusedElement.current as HTMLElement).focus()
      }
    }
  }, [mobileOpen])

  React.useEffect(() => {
    setMobileOpen(false)
  }, [router.asPath])
  

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="lg:flex lg:min-h-screen lg:items-stretch">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block lg:w-72 lg:shrink-0 lg:border-r lg:border-slate-200 lg:bg-white">
          <div className="sticky top-0 h-screen overflow-y-auto">
            <AdminSidebar />
          </div>
        </aside>

        {/* Mobile sidebar (overlay) */}
        <div className={`fixed inset-0 z-40 lg:hidden ${mobileOpen ? '' : 'pointer-events-none'}`} aria-hidden={!mobileOpen}>
          {/* backdrop */}
          <div onClick={() => setMobileOpen(false)} className={`absolute inset-0 bg-black/40 transition-opacity ${mobileOpen ? 'opacity-100' : 'opacity-0'}`} />
          <aside
            ref={sidebarRef}
            role="dialog"
            aria-modal="true"
            aria-hidden={!mobileOpen}
            tabIndex={-1}
            className={`absolute left-0 top-0 bottom-0 w-[88vw] max-w-80 overflow-y-auto border-r border-slate-200 bg-white shadow-2xl transform transition-transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <FocusLock disabled={!mobileOpen} returnFocus>
              <div className="h-full">
                <AdminSidebar onNavigate={() => setMobileOpen(false)} />
              </div>
            </FocusLock>
          </aside>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar onToggle={() => setMobileOpen((s) => !s)} mobileOpen={mobileOpen} />
          <main className="flex-1 px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}
