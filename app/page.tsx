"use client"

import { useState, useEffect } from "react"
import dynamic from 'next/dynamic'
import { Globe, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/Sidebar"
import { REGION_MAPPING } from "../utils/regionMapping"
import { Community } from "@/types"
import SearchHeader from '@/components/SearchHeader'

// Importar el mapa de forma dinámica para evitar errores de SSR
const DynamicMap = dynamic(() => import('../components/map'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  )
})

export default function Home() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const loadCommunities = async () => {
      try {
        const response = await fetch('/data/communities.json')
        const data = await response.json()
        setCommunities(data)
      } catch (error) {
        console.error('Error loading communities:', error)
      }
    }
    loadCommunities()
  }, [])

  // Organizar comunidades por región y país
  const communityGroups = communities.reduce((acc, community) => {
    const region = REGION_MAPPING[community.country] || 'Other'
    
    if (!acc[region]) {
      acc[region] = { countries: {} }
    }
    
    if (!acc[region].countries[community.country]) {
      acc[region].countries[community.country] = []
    }
    
    acc[region].countries[community.country].push(community)
    return acc
  }, {} as Record<string, { countries: Record<string, Community[]> }>)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // Aquí implementaremos la lógica de búsqueda
  }

  return (
    <div className="h-screen flex bg-white">
      <Sidebar
        communityGroups={communityGroups}
        selectedRegion={selectedRegion}
        selectedCountry={selectedCountry}
        onRegionSelect={(region) => {
          setSelectedRegion(region)
          setSelectedCountry(null)
          setSelectedCommunity(null)
        }}
        onCountrySelect={(country) => {
          setSelectedCountry(country)
          setSelectedCommunity(null)
        }}
        onCommunitySelect={(community) => {
          setSelectedCountry(community.country)
          setSelectedCommunity(community)
        }}
      />
      
      <div className="flex-1 flex flex-col">
        <SearchHeader 
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
        />
        <main className="flex-1">
          <DynamicMap
            communities={communities}
            selectedRegion={selectedRegion}
            selectedCountry={selectedCountry}
            selectedCommunity={selectedCommunity}
          />
        </main>
      </div>
    </div>
  )
}

