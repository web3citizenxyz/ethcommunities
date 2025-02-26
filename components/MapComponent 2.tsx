"use client"

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { getCommunityCoordinates } from '@/utils/geocoding'

interface Community {
  name: string
  website?: string
  twitter?: string
  contact?: string
  city?: string
  country: string
}

interface MapProps {
  communities: Community[]
  selectedCountry?: string | null
  selectedCommunity?: Community | null
}

// Configurar el icono por defecto
const icon = L.icon({
  iconUrl: '/images/marker-icon.png',
  iconRetinaUrl: '/images/marker-icon-2x.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

export default function MapComponent({ communities, selectedCountry, selectedCommunity }: MapProps) {
  const [markers, setMarkers] = useState<Array<{
    community: Community
    position: [number, number]
  }>>([])

  useEffect(() => {
    const loadMarkers = async () => {
      const newMarkers = []
      for (const community of communities) {
        try {
          const coords = await getCommunityCoordinates(community)
          newMarkers.push({
            community,
            position: [coords.lat, coords.lng] as [number, number]
          })
        } catch (error) {
          console.error(`Error loading coordinates for ${community.name}:`, error)
        }
      }
      setMarkers(newMarkers)
    }

    loadMarkers()
  }, [communities])

  return (
    <div className="h-[500px] relative rounded-lg overflow-hidden border border-border bg-card">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map(({ community, position }) => (
          <Marker 
            key={community.name} 
            position={position}
            icon={icon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg mb-1">{community.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {community.city ? `${community.city}, ` : ''}
                  {community.country}
                </p>
                <div className="space-y-1">
                  {community.website && (
                    <a
                      href={community.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1 text-sm"
                    >
                      🌐 Website
                    </a>
                  )}
                  {community.twitter && (
                    <a
                      href={community.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1 text-sm"
                    >
                      🐦 Twitter
                    </a>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
} 