import React from 'react'

type Application = { id?: string; type?: string; payload?: Record<string, unknown>; createdAt?: string; read?: boolean }

type Props = {
  application: Application
  onMarkRead?: (id?: string) => void
  onDelete?: (id?: string) => void
}

export default function ApplicationCard({ application, onMarkRead, onDelete }: Props) {
  const payload = application.payload || {} as Record<string, unknown>
  const company = String((payload['companyName'] ?? payload['company'] ?? '') || '')
  const contact = String((payload['contactName'] ?? payload['contact'] ?? '') || '')
  const email = String(payload['email'] ?? '')
  const phone = String(payload['phone'] ?? '')
  const country = String(payload['country'] ?? '')
  const colorsRaw = String(payload['colorOptions'] ?? '')
  const colors = colorsRaw.split(',').map((s) => s.trim()).filter(Boolean)
  const estimated = String(payload['estimatedBulkOrder'] ?? '')
  const message = String(payload['message'] ?? '')

  const created = application.createdAt ? new Date(application.createdAt) : null
  const createdDisplay = created ? created.toLocaleString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''

  return (
    <article className={`w-full rounded-xl border p-4 shadow-sm transition-colors ${application.read ? 'border-slate-200 bg-slate-50' : 'border-blue-100 bg-white'}`} aria-labelledby={`app-${application.id}`}>
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex items-start gap-4">
          <div className="flex min-w-0 flex-col">
            <h3 id={`app-${application.id}`} className="text-lg font-semibold text-gray-900 leading-tight">
              {company || '—'}
            </h3>
            <div className="text-sm text-gray-500">{application.type} • {createdDisplay}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {country && <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">{country}</span>}
          <div className="flex flex-wrap items-center gap-2">
            {application.read && <span className="inline-flex items-center rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600">Okundu</span>}
            {!application.read && (
              <button onClick={() => onMarkRead?.(application.id)} className="rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700">Okundu</button>
            )}
            <button onClick={() => onDelete?.(application.id)} className="rounded-full bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700">Sil</button>
          </div>
        </div>
      </header>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section aria-labelledby={`company-${application.id}`} className="md:col-span-1">
          <h4 id={`company-${application.id}`} className="text-sm text-gray-500">Company Info</h4>
          <dl className="mt-2 text-sm text-gray-700 space-y-1">
            <div>
              <dt className="text-xs text-gray-500">Firma</dt>
              <dd className="font-medium">{company || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Ülke</dt>
              <dd className="font-medium">{country || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Website</dt>
              <dd className="break-words font-medium">{payload['website'] ? <a className="text-amber-600 hover:underline break-all" href={String(payload['website'])} target="_blank" rel="noreferrer">{String(payload['website'])}</a> : '—'}</dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby={`product-${application.id}`} className="md:col-span-1">
          <h4 id={`product-${application.id}`} className="text-sm text-gray-500">Product Info</h4>
          <dl className="mt-2 text-sm text-gray-700 space-y-1">
            <div>
              <dt className="text-xs text-gray-500">Marka</dt>
              <dd className="font-medium">{String(payload['activeBrand'] ?? '—')}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Hedef Pazar</dt>
              <dd className="font-medium">{String(payload['targetMarket'] ?? '—')}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Model Sayısı</dt>
              <dd className="font-medium">{String(payload['modelCount'] ?? '—')}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Renkler</dt>
              <dd className="mt-1 flex flex-wrap gap-2">{colors.length ? colors.map((c) => (<span key={c} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">{c}</span>)) : '—'}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Tahmini Toplu Sipariş</dt>
              <dd className="font-medium">{estimated === '0' || estimated === '' ? 'Not specified' : estimated}</dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby={`contact-${application.id}`} className="md:col-span-1">
          <h4 id={`contact-${application.id}`} className="text-sm text-gray-500">Contact Info</h4>
          <dl className="mt-2 text-sm text-gray-700 space-y-1">
            <div>
              <dt className="text-xs text-gray-500">Kişi</dt>
              <dd className="font-medium">{contact || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">E-posta</dt>
              <dd className="font-medium break-words">{email ? <a className="text-amber-600 hover:underline break-all" href={`mailto:${email}`}>{email}</a> : '—'}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Telefon</dt>
              <dd className="font-medium">{phone ? <a className="text-amber-600 hover:underline" href={`tel:${phone}`}>{phone}</a> : '—'}</dd>
            </div>
          </dl>
        </section>
      </div>

      {message && (
        <section aria-labelledby={`message-${application.id}`} className="mt-4">
          <h4 id={`message-${application.id}`} className="text-sm text-gray-500">Message</h4>
          <div className="mt-2 p-3 bg-gray-50 rounded text-sm text-gray-800 whitespace-pre-wrap">{message}</div>
        </section>
      )}
    </article>
  )
}
