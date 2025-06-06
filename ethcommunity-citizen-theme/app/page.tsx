"use client"

import { useState, useEffect } from "react"
import dynamic from 'next/dynamic'
import { Globe, Plus, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/Sidebar"
import { REGION_MAPPING } from "@/utils/regionMapping"
import { Community } from "@/types"
import SearchHeader from '@/components/SearchHeader'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Link from 'next/link'

// Importar el mapa de forma dinámica para evitar errores de SSR
const DynamicMap = dynamic(() => import('@/components/map'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#F1EAE1]"></div>
    </div>
  )
})

export default function Home() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null)
  const [selectedChain, setSelectedChain] = useState<string | null>(null)
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

  // Filter communities based on selected chain
  const filteredCommunities = selectedChain
    ? communities.filter(community => {
        console.log('Filtering community:', community.name, 'chain:', community.chain, 'selected chain:', selectedChain)
        return community.chain === selectedChain
      })
    : communities
  
  console.log('Selected chain:', selectedChain)
  console.log('Filtered communities:', filteredCommunities)

  // Organize communities by region and country
  const communityGroups = filteredCommunities.reduce((acc, community) => {
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

  const handleSearchResult = (result: { type: 'country' | 'community' | 'chain', value: string | Community }) => {
    if (result.type === 'country') {
      setSelectedRegion(REGION_MAPPING[result.value as string])
      setSelectedCountry(result.value as string)
      setSelectedCommunity(null)
      setSelectedChain(null)
    } else if (result.type === 'chain') {
      setSelectedChain(result.value as string)
      setSelectedRegion(null)
      setSelectedCountry(null)
      setSelectedCommunity(null)
    } else {
      const community = result.value as Community
      setSelectedRegion(REGION_MAPPING[community.country])
      setSelectedCountry(community.country)
      setSelectedCommunity(community)
      setSelectedChain(null)
    }
  }

  // Calculate metrics for communities by region and sort by count
  const communityMetrics = Object.entries(communityGroups)
    .reduce((acc, [region, data]) => {
      const count = Object.values(data.countries).flat().length
      return [...acc, { region, count }]
    }, [] as Array<{ region: string, count: number }>)
    .sort((a, b) => b.count - a.count)

  return (
    <div className="snap-container bg-[#2A2D39]">
      {/* Map Section */}
      <section className="snap-section relative">
        <div className="h-screen flex flex-col bg-[#2A2D39]">
          {/* Header with title and search */}
          <div className="border-b border-[#F1EAE1]/20">
            <div className="px-4 py-4 flex items-center justify-between">
              <div>
                <span className="text-white text-lg font-medium">ETH Communities</span>
              </div>
              <div className="flex items-center gap-4">
                <SearchHeader 
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  communities={communities}
                  onSelectResult={handleSearchResult}
                />
              </div>
            </div>
          </div>

          {/* Título central */}
          <div key="title-section" className="pt-16 pb-8 text-center">
            <h1 className="text-3xl font-semibold text-white mb-4">ETH Communities</h1>
            <p className="text-zinc-400">
              10K+ communities around the world.{' '}
              <Link href="/add-community" className="text-blue-400 hover:text-blue-300">
                Submit your own
              </Link>
            </p>
          </div>

          {/* Main content with sidebar and map */}
          <div className="flex-1 flex min-h-0">
            <Sidebar
              communityGroups={communityGroups}
              selectedRegion={selectedRegion}
              selectedCountry={selectedCountry}
              onRegionSelect={(region) => {
                setSelectedRegion(region)
                setSelectedCountry(null)
                setSelectedCommunity(null)
                setSelectedChain(null)
              }}
              onCountrySelect={(country) => {
                setSelectedCountry(country)
                setSelectedCommunity(null)
                setSelectedChain(null)
              }}
              onCommunitySelect={(community) => {
                setSelectedCountry(community.country)
                setSelectedCommunity(community)
                setSelectedChain(null)
              }}
            />
            
            <main className="flex-1 p-8 flex flex-col">
              <div className="container mx-auto">
                <div className="bg-[#2A2D39] rounded-xl shadow-lg border border-[#F1EAE1]/20 p-6" 
                     style={{ height: '70vh', maxHeight: '800px' }}>
                  <DynamicMap
                    key={`map-${selectedRegion}-${selectedCountry}-${selectedCommunity?.name}-${Date.now()}`}
                    communities={filteredCommunities}
                    selectedRegion={selectedRegion}
                    selectedCountry={selectedCountry}
                    selectedCommunity={selectedCommunity}
                  />
                </div>
              </div>
            </main>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <a href="#about" className="text-[#F1EAE1]/70 hover:text-[#F1EAE1]">
              <ChevronDown size={24} />
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="snap-section bg-[#2A2D39] relative flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-[#F1EAE1] sm:text-4xl">
              What is ETH Communities?
            </h2>
            <p className="mt-4 text-xl text-[#F1EAE1]/70">
              Connecting Ethereum communities worldwide
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#F1EAE1] text-[#2A2D39] mx-auto">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-[#F1EAE1]">Global Network</h3>
                <p className="mt-2 text-base text-[#F1EAE1]/70">
                  Connect with and learn from the various communities across the globe.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#F1EAE1] text-[#2A2D39] mx-auto">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-medium text-[#F1EAE1]">Community-Driven</h3>
                <p className="mt-2 text-base text-[#F1EAE1]/70">
                  ETH Communities is built by the community.<br />
                  Add your local cabal and grow the garden.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#F1EAE1] text-[#2A2D39] mx-auto">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L22 12L12 22L2 12L12 2z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-medium text-[#F1EAE1]">Rollup Agnostic</h3>
                <p className="mt-2 text-base text-[#F1EAE1]/70">
                  From L1 to L2s, we support all ETH communities. <br />
                  If your community L2 centric, just add the specific chain.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a href="#metrics" className="text-[#F1EAE1]/70 hover:text-[#F1EAE1]">
            <ChevronDown size={24} />
          </a>
        </div>
      </section>

      {/* Metrics Section */}
      <section id="metrics" className="snap-section bg-[#2A2D39]">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-[#F1EAE1] sm:text-4xl">
              {communities.length}+ Communities Worldwide
            </h2>
            <p className="mt-4 text-xl text-[#F1EAE1]/70">
              Growing stronger across every continent
            </p>
          </div>

          <div className="mt-20">
            <div className="bg-[#2A2D39]">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={communityMetrics} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <XAxis 
                    dataKey="region" 
                    tick={{ fill: '#F1EAE1' }}
                    axisLine={{ stroke: '#F1EAE1' }}
                    tickLine={false}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#F1EAE1"
                    radius={[4, 4, 0, 0]}
                    name="Communities"
                  />
                  <Tooltip 
                    cursor={false}
                    contentStyle={{
                      backgroundColor: '#2A2D39',
                      border: 'none',
                      borderRadius: '0.375rem',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                      color: '#F1EAE1'
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-20 text-sm text-[#F1EAE1]/70 text-center">
            <p>
              maintained with ❤️ by{' '}
              <a 
                href="https://github.com/yourusername/ethcommunity" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F1EAE1] hover:text-[#F1EAE1]/80"
              >
                Web3 Citizen
              </a>
            </p>
          </footer>
        </div>
      </section>
    </div>
  )
}

