import React from 'react'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'

type Props = {
  children: React.ReactNode
}

export default function AdminLayout({ children }: Props) {
  const [mobileOpen, setMobileOpen] = React.useState(false)

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
          <aside className={`absolute left-0 top-0 bottom-0 w-64 bg-white border-r transform transition-transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="h-full">
              <AdminSidebar />
            </div>
          </aside>
        </div>

        <div className="flex-1">
          <AdminTopbar onToggle={() => setMobileOpen((s) => !s)} mobileOpen={mobileOpen} />

          {/* banner removed per user request */}

          <main className="p-4 sm:p-6 max-w-6xl mx-auto">{children}</main>
        </div>
      </div>
    </div>
  )
}
