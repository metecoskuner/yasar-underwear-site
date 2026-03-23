import React, { useState, useEffect } from 'react'
import { MAP_PLACES } from '@/config/mapPlaces'

interface SelectedPlace {
  id: string
  title: string
  addr: string
  lat: number
  lng: number
}

export default function ContactMap() {
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>(MAP_PLACES[0] ? {
    id: MAP_PLACES[0].id,
    title: MAP_PLACES[0].title,
    addr: MAP_PLACES[0].addr,
    lat: MAP_PLACES[0].lat,
    lng: MAP_PLACES[0].lng
  } : null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    // Leaflet scripti yükle
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'
    script.onload = () => {
      setMapLoaded(true)
    }
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(link)
      document.head.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (!mapLoaded || !selectedPlace) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const L = (window as any).L

    // Harita oluştur
    const map = L.map('contact-map').setView([selectedPlace.lat, selectedPlace.lng], 12)

    // OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map)

    // Tüm markerları ekle
    MAP_PLACES.forEach((place) => {
      const isSelected = selectedPlace.id === place.id
      const markerColor = isSelected ? '#fbbf24' : '#ef4444'
      const markerSize = isSelected ? 40 : 30

      const customIcon = L.divIcon({
        html: `
          <div style="
            width: ${markerSize}px;
            height: ${markerSize}px;
            background-color: ${markerColor};
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: all 0.2s;
          ">
            <div style="
              width: 8px;
              height: 8px;
              background-color: white;
              border-radius: 50%;
            "></div>
          </div>
        `,
        iconSize: [markerSize, markerSize],
        iconAnchor: [markerSize / 2, markerSize / 2],
        popupAnchor: [0, -markerSize / 2]
      })

      L.marker([place.lat, place.lng], { icon: customIcon })
        .bindPopup(`<div class="text-sm"><strong>${place.title}</strong><br/>${place.addr}</div>`)
        .on('click', () => {
          setSelectedPlace({
            id: place.id,
            title: place.title,
            addr: place.addr,
            lat: place.lat,
            lng: place.lng
          })
        })
        .addTo(map)
    })

    return () => {
      map.remove()
    }
  }, [mapLoaded, selectedPlace])

  return (
    <div className="w-full bg-white rounded-xl p-8 shadow-md border border-slate-200">
      <h2 className="text-2xl font-bold mb-6 text-slate-900">Konumlarımız Haritada</h2>
      
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Map */}
        <div className="lg:col-span-3">
          <div 
            id="contact-map" 
            className="w-full h-96 lg:h-full min-h-96 rounded-lg border-2 border-slate-200 overflow-hidden"
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-3 max-h-96 overflow-y-auto">
          <h3 className="font-semibold text-slate-900 sticky top-0 bg-white pb-2">Lokasyonlar</h3>
          {MAP_PLACES.map((place) => (
            <button
              key={place.id}
              onClick={() =>
                setSelectedPlace({
                  id: place.id,
                  title: place.title,
                  addr: place.addr,
                  lat: place.lat,
                  lng: place.lng
                })
              }
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedPlace?.id === place.id
                  ? 'bg-black text-white'
                  : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
              }`}
            >
              <p className="font-medium text-sm">{place.title}</p>
              <p className="text-xs mt-1 line-clamp-2 opacity-75">{place.addr}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Place Info */}
      {selectedPlace && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-blue-900">{selectedPlace.title}</h3>
          <p className="text-sm text-blue-800 mt-2">{selectedPlace.addr}</p>
          <p className="text-xs text-blue-700 mt-2">
            📍 {selectedPlace.lat.toFixed(4)}, {selectedPlace.lng.toFixed(4)}
          </p>
          <a
            href={`https://maps.google.com/?q=${selectedPlace.lat},${selectedPlace.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-sm font-medium text-blue-600 hover:text-blue-800 underline"
          >
            Google Maps'te Aç →
          </a>
        </div>
      )}
    </div>
  )
}
