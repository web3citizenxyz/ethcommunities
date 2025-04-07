'use client'

import dynamic from 'next/dynamic'
import { Community } from '../types'

const LeafletMap = dynamic(() => import('./LeafletMap'), { 
  ssr: false,
  loading: () => <div>Loading map...</div>
})

interface MapComponentProps {
  center: number[]
  zoom: number
  communities: Community[]
  selectedRegion: string | null
  selectedCountry: string | null
}

export default function MapComponent({
  center,
  zoom,
  communities,
  selectedRegion,
  selectedCountry
}: MapComponentProps) {
  return (
    <div className="h-full w-full">
      <LeafletMap
        center={[center[0], center[1]]}
        zoom={zoom}
        communities={communities}
      />
    </div>
  )
} 