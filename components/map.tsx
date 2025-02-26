"use client"

import { useEffect, useRef, useMemo } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { COUNTRY_COORDINATES } from '@/utils/geocoding'
import 'leaflet/dist/leaflet.css'
import dynamic from 'next/dynamic'

interface Community {
  name: string
  website?: string
  twitter?: string
  country: string
  city?: string
}

interface MapProps {
  communities: Community[]
  selectedRegion: string | null
  selectedCountry: string | null
  selectedCommunity: Community | null
}

// Componente para manejar los cambios de vista
function MapController({ 
  selectedCountry, 
  selectedRegion,
  selectedCommunity,
  communities 
}: { 
  selectedCountry: string | null
  selectedRegion: string | null
  selectedCommunity: Community | null
  communities: Community[]
}) {
  const map = useMap()
  const lastCountryRef = useRef<string | null>(null)
  const manualZoomRef = useRef<boolean>(false)
  const initialZoomDoneRef = useRef<boolean>(false)

  // Detectar zoom manual
  useEffect(() => {
    const handleZoom = () => {
      if (initialZoomDoneRef.current) {
        manualZoomRef.current = true;
      }
    };

    map.on('zoomend', handleZoom);
    return () => {
      map.off('zoomend', handleZoom);
    };
  }, [map]);

  useEffect(() => {
    const handleNavigation = () => {
      if (selectedCommunity) {
        const coordinates = COUNTRY_COORDINATES[selectedCommunity.country]
        if (coordinates) {
          const isAlreadyInCountry = selectedCommunity.country === lastCountryRef.current
          
          if (!isAlreadyInCountry || !initialZoomDoneRef.current) {
            map.flyTo(coordinates, 6)
            initialZoomDoneRef.current = true
            manualZoomRef.current = false
          } else {
            // Si ya estamos en el país, solo centramos en la comunidad
            const countryCommunities = communities.filter(c => c.country === selectedCommunity.country)
            const index = countryCommunities.findIndex(c => c.name === selectedCommunity.name)
            
            if (countryCommunities.length > 1 && index !== -1) {
              const offset = 0.5
              const adjustedCoordinates: [number, number] = [
                coordinates[0] + (index * offset * (Math.random() > 0.5 ? 1 : -1)),
                coordinates[1] + (index * offset * (Math.random() > 0.5 ? 1 : -1))
              ]
              map.panTo(adjustedCoordinates)
            } else {
              map.panTo(coordinates)
            }
          }
          lastCountryRef.current = selectedCommunity.country
        }
      } else if (selectedCountry) {
        const coordinates = COUNTRY_COORDINATES[selectedCountry]
        if (coordinates) {
          if (!initialZoomDoneRef.current || lastCountryRef.current !== selectedCountry) {
            map.flyTo(coordinates, 6)
            initialZoomDoneRef.current = true
            manualZoomRef.current = false
          }
          lastCountryRef.current = selectedCountry
        }
      } else if (selectedRegion) {
        const regionView = {
          'North America': { 
            center: [45, -95] as [number, number], 
            zoom: 4 
          },
          'South America': { 
            center: [-20, -65] as [number, number], 
            zoom: 4 
          },
          'Europe': { 
            center: [50, 15] as [number, number], 
            zoom: 4 
          },
          'Asia': { 
            center: [35, 105] as [number, number], 
            zoom: 3.5 
          },
          'Africa': { 
            center: [5, 20] as [number, number], 
            zoom: 3.5 
          },
          'Oceania': { 
            center: [-25, 135] as [number, number], 
            zoom: 4 
          }
        }[selectedRegion]

        if (regionView) {
          map.flyTo(regionView.center, regionView.zoom, {
            duration: 1.5 // Duración de la animación en segundos
          })
          initialZoomDoneRef.current = false
          lastCountryRef.current = null
        }
      }
    }

    handleNavigation()
  }, [map, selectedCountry, selectedRegion, selectedCommunity, communities])

  return null
}

function CommunityMarkers({ 
  communities,
  selectedCountry,
  selectedCommunity 
}: { 
  communities: Community[]
  selectedCountry: string | null
  selectedCommunity: Community | null
}) {
  const map = useMap()
  const markerRefs = useRef<Record<string, L.Marker>>({})

  // Filtrar comunidades si hay un país seleccionado
  const filteredCommunities = selectedCountry 
    ? communities.filter(c => c.country === selectedCountry)
    : communities

  const communitiesByCountry = filteredCommunities.reduce((acc, community) => {
    if (!acc[community.country]) {
      acc[community.country] = []
    }
    acc[community.country].push(community)
    return acc
  }, {} as Record<string, Community[]>)

  // Efecto para abrir el popup de la comunidad seleccionada
  useEffect(() => {
    if (selectedCommunity) {
      const markerId = `${selectedCommunity.name}-${selectedCommunity.country}`
      const marker = markerRefs.current[markerId]
      if (marker) {
        marker.openPopup()
      }
    }
  }, [selectedCommunity])

  return (
    <>
      {Object.entries(communitiesByCountry).map(([country, communities]) => {
        const coordinates = COUNTRY_COORDINATES[country]
        if (!coordinates) {
          console.warn(`No coordinates found for country: ${country}`)
          return null
        }

        return communities.map((community, index) => {
          const offset = 0.5
          const adjustedCoordinates: [number, number] = communities.length > 1 
            ? [
                coordinates[0] + (index * offset * (Math.random() > 0.5 ? 1 : -1)),
                coordinates[1] + (index * offset * (Math.random() > 0.5 ? 1 : -1))
              ]
            : coordinates

          const markerId = `${community.name}-${community.country}`

          return (
            <Marker 
              key={markerId}
              position={adjustedCoordinates}
              ref={(ref) => {
                if (ref) {
                  markerRefs.current[markerId] = ref
                }
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">{community.name}</h3>
                  <p className="text-sm text-gray-600">
                    {community.city ? `${community.city}, ` : ''}{community.country}
                  </p>
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
          )
        })
      })}
    </>
  )
}

const MapWithNoSSR = dynamic(
  () => Promise.resolve(({ 
    communities, 
    selectedRegion, 
    selectedCountry, 
    selectedCommunity 
  }: MapProps) => {
    useEffect(() => {
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconUrl: '/images/marker-icon.png',
        iconRetinaUrl: '/images/marker-icon-2x.png',
        shadowUrl: '/images/marker-shadow.png',
      })
    }, [])

    return (
      <div className="h-full w-full relative z-0">
        <MapContainer
          id="main-map"
          key="main-map-container"
          center={[30, 10]}
          zoom={3}
          className="h-full w-full"
          zoomControl={true}
          minZoom={3}
          maxZoom={19}
          maxBounds={[[-50, -170], [80, 190]]}
          maxBoundsViscosity={1.0}
          worldCopyJump={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            subdomains={'abcd'}
            maxZoom={19}
            noWrap={true}
            bounds={[[-50, -170], [80, 190]]}
          />
          <CommunityMarkers 
            communities={communities} 
            selectedCountry={selectedCountry}
            selectedCommunity={selectedCommunity}
          />
          <MapController 
            selectedCountry={selectedCountry} 
            selectedRegion={selectedRegion}
            selectedCommunity={selectedCommunity}
            communities={communities}
          />
        </MapContainer>
      </div>
    )
  }),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }
)

export default MapWithNoSSR 