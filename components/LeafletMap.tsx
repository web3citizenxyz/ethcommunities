'use client'

import { useEffect } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Community } from '../types'
import 'leaflet/dist/leaflet.css'

interface LeafletMapProps {
  center: [number, number]
  zoom: number
  communities: Community[]
}

export default function LeafletMap({ center, zoom, communities }: LeafletMapProps) {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/images/marker-icon-2x.png',
      iconUrl: '/images/marker-icon.png',
      shadowUrl: '/images/marker-shadow.png',
    })
  }, [])

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-full w-full"
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {communities.map((community) => (
        <Marker 
          key={community.name}
          position={[community.latitude, community.longitude]}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold">{community.name}</h3>
              {community.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {community.description}
                </p>
              )}
              <div className="mt-2 space-y-1">
                {community.website && (
                  <a
                    href={community.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm block"
                  >
                    Website
                  </a>
                )}
                {community.twitter && (
                  <a
                    href={community.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm block"
                  >
                    Twitter
                  </a>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
} 