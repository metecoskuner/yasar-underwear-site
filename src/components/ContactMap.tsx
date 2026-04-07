import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { MAP_PLACES } from '@/config/mapPlaces'

type PlaceView = {
  id: string
  title: string
  addr: string
  lat: number
  lng: number
  mapsUrl?: string
}

type LeafletMap = {
  setView: (center: [number, number], zoom: number, options?: { animate?: boolean }) => void
  fitBounds: (bounds: unknown, options?: { padding?: [number, number] }) => void
  remove: () => void
}

type LeafletMarker = {
  setIcon: (icon: unknown) => void
  openPopup: () => void
  addTo: (map: LeafletMap) => void
  bindPopup: (html: string) => LeafletMarker
  on: (event: string, cb: () => void) => LeafletMarker
}

type LeafletGlobal = {
  map: (el: string | HTMLElement, options?: Record<string, unknown>) => LeafletMap
  tileLayer: (url: string, options?: Record<string, unknown>) => { addTo: (map: LeafletMap) => void }
  marker: (coords: [number, number], options?: Record<string, unknown>) => LeafletMarker
  divIcon: (options: Record<string, unknown>) => unknown
  latLngBounds: (points: [number, number][]) => unknown
}

declare global {
  interface Window {
    L?: LeafletGlobal
  }
}

function createMarkerIcon(L: LeafletGlobal, isActive: boolean) {
  const size = isActive ? 38 : 28
  const outer = isActive ? '#f59e0b' : '#0f172a'
  return L.divIcon({
    html: `
      <div style="
        width:${size}px;
        height:${size}px;
        border-radius:9999px;
        background:${outer};
        border:4px solid #ffffff;
        box-shadow:0 10px 25px rgba(15,23,42,0.22);
        display:flex;
        align-items:center;
        justify-content:center;
      ">
        <div style="
          width:${isActive ? 10 : 8}px;
          height:${isActive ? 10 : 8}px;
          border-radius:9999px;
          background:#ffffff;
        "></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
    className: 'contact-map-pin',
  })
}

export default function ContactMap() {
  const { t } = useLanguage()
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(MAP_PLACES[0]?.id ?? null)
  const [mapReady, setMapReady] = useState(() => Boolean(typeof window !== 'undefined' && window.L))
  const [mapError, setMapError] = useState(false)
  const mapRef = useRef<LeafletMap | null>(null)
  const markersRef = useRef<Map<string, LeafletMarker>>(new Map())

  const places = useMemo<PlaceView[]>(
    () =>
      MAP_PLACES.map((place) => {
        const key = `mapPlaces.${place.id}` as const
        const translated = t(key)
        return {
          ...place,
          title: translated !== key ? String(translated) : place.title,
        }
      }),
    [t]
  )

  const selectedPlace = useMemo(
    () => places.find((place) => place.id === selectedPlaceId) ?? places[0] ?? null,
    [places, selectedPlaceId]
  )

  useEffect(() => {
    if (typeof document === 'undefined') return
    if (window.L) {
      if (!mapReady) {
        window.setTimeout(() => setMapReady(true), 0)
      }
      return
    }

    const stylesheetHref = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'
    const scriptSrc = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'

    if (!document.querySelector(`link[href="${stylesheetHref}"]`)) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = stylesheetHref
      document.head.appendChild(link)
    }

    const existingScript = document.querySelector(`script[src="${scriptSrc}"]`) as HTMLScriptElement | null
    if (existingScript) {
      const onLoad = () => setMapReady(true)
      existingScript.addEventListener('load', onLoad)
      return () => existingScript.removeEventListener('load', onLoad)
    }

    const script = document.createElement('script')
    script.src = scriptSrc
    script.async = true
    script.onload = () => setMapReady(true)
    script.onerror = () => setMapError(true)
    document.head.appendChild(script)

    return () => {
      script.onload = null
      script.onerror = null
    }
  }, [mapReady])

  useEffect(() => {
    if (!mapReady || !selectedPlace || mapRef.current || !window.L) return

    const L = window.L
    const map = L.map('contact-map-canvas', {
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: false,
    })
    mapRef.current = map

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    const boundsPoints: [number, number][] = []
    const markerStore = markersRef.current

    places.forEach((place) => {
      boundsPoints.push([place.lat, place.lng])
      const marker = L.marker([place.lat, place.lng], {
        icon: createMarkerIcon(L, place.id === selectedPlace.id),
      })
        .bindPopup(
          `<div style="font: 13px/1.4 system-ui, sans-serif;"><strong>${place.title}</strong><br/>${place.addr}</div>`
        )
        .on('click', () => setSelectedPlaceId(place.id))

      marker.addTo(map)
      markerStore.set(place.id, marker)
    })

    if (boundsPoints.length > 1) {
      map.fitBounds(L.latLngBounds(boundsPoints), { padding: [48, 48] })
    } else {
      map.setView([selectedPlace.lat, selectedPlace.lng], 14)
    }

    return () => {
      markerStore.clear()
      map.remove()
      mapRef.current = null
    }
  }, [mapReady, places, selectedPlace])

  useEffect(() => {
    if (!selectedPlace || !window.L || !mapRef.current) return

    const L = window.L
    mapRef.current.setView([selectedPlace.lat, selectedPlace.lng], 14, { animate: true })

    places.forEach((place) => {
      const marker = markersRef.current.get(place.id)
      if (!marker) return
      marker.setIcon(createMarkerIcon(L, place.id === selectedPlace.id))
      if (place.id === selectedPlace.id) {
        marker.openPopup()
      }
    })
  }, [places, selectedPlace])

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{t('contact.mapTitle')}</h2>
          <p className="mt-1 text-sm text-slate-500">{t('contact.locationsTitle')}</p>
        </div>
        <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {places.length} lokasyon
        </div>
      </div>

      {mapError && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Harita yüklenemedi. Aşağıdaki lokasyonlardan Google Maps’e geçebilirsiniz.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
            <div
              id="contact-map-canvas"
              className="h-[22rem] w-full sm:h-[28rem] lg:h-[34rem]"
              aria-label={t('contact.mapTitle')}
            />
          </div>
        </div>

        <div className="space-y-3 lg:max-h-[34rem] lg:overflow-y-auto lg:pr-1">
          <h3 className="sticky top-0 bg-white pb-2 font-semibold text-slate-900">{t('contact.locationsTitle')}</h3>
          {places.map((place) => {
            const isActive = selectedPlace?.id === place.id
            return (
              <button
                key={place.id}
                type="button"
                onClick={() => setSelectedPlaceId(place.id)}
                className={`w-full rounded-2xl border p-3 text-left transition-all ${
                  isActive
                    ? 'border-black bg-black text-white shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100'
                }`}
              >
                <p className="font-medium text-sm">{place.title}</p>
                <p className={`mt-2 line-clamp-3 text-xs ${isActive ? 'text-white/75' : 'text-slate-500'}`}>{place.addr}</p>
              </button>
            )
          })}
        </div>
      </div>

      {selectedPlace && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="font-bold text-slate-900">{selectedPlace.title}</h3>
              <p className="mt-2 text-sm text-slate-700">{selectedPlace.addr}</p>
            </div>
            <a
              href={selectedPlace.mapsUrl || `https://maps.google.com/?q=${selectedPlace.lat},${selectedPlace.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              {t('contact.googleMapsLink')}
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
