import React from 'react'
import FocusLock from 'react-focus-lock'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'

type Props = {
  children: React.ReactNode
}

export default function AdminLayout({ children }: Props) {
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
  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:flex lg:items-stretch">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block lg:w-64 bg-gradient-to-b from-white to-slate-50 border-r">
          <div className="h-full">
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
            className={`absolute left-0 top-0 bottom-0 w-64 bg-white border-r transform transition-transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <FocusLock disabled={!mobileOpen} returnFocus>
              <div className="h-full">
                <AdminSidebar />
              </div>
            </FocusLock>
          </aside>
        </div>

        <div className="flex-1">
          <AdminTopbar onToggle={() => setMobileOpen((s) => !s)} mobileOpen={mobileOpen} />

          {/* pink reload logo removed as requested */}

          <main className="p-4 sm:p-6 max-w-6xl mx-auto">{children}</main>
        </div>
      </div>
    </div>
  )
}
