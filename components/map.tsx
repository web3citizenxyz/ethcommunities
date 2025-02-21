"use client"

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Configuración del icono por defecto
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon-2x.png',
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
})

interface Community {
  name: string
  website?: string
  twitter?: string
  contact?: string
  city?: string
  country: string
}

export default function Map({ communities = [] }: { communities: Community[] }) {
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    // Inicializar el mapa solo si no existe
    if (!mapRef.current) {
      const map = L.map('map').setView([20, 0], 2)
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)

      // Solo un marcador en [0,0] para prueba
      communities.forEach(community => {
        L.marker([0, 0])
          .bindPopup(`
            <div class="popup-content">
              <h3 class="font-bold">${community.name}</h3>
              <p>${community.city ? `${community.city}, ` : ''}${community.country}</p>
              ${community.website ? `<a href="${community.website}" target="_blank" class="text-blue-500 hover:underline">Website</a>` : ''}
              ${community.twitter ? `<br/><a href="${community.twitter}" target="_blank" class="text-blue-500 hover:underline">Twitter</a>` : ''}
            </div>
          `)
          .addTo(map)
      })

      mapRef.current = map
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [communities])

  return (
    <div 
      id="map" 
      style={{ 
        height: '600px',
        width: '100%',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
      }} 
    />
  )
} 