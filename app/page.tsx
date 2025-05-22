"use client"

import { useState, useEffect } from "react"
import dynamic from 'next/dynamic'
import { Globe, Plus, ChevronDown, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/Sidebar"
import { REGION_MAPPING } from "@/utils/regionMapping"
import { Community } from "@/types"
import SearchHeader from '@/components/SearchHeader'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Link from 'next/link'

const DynamicMap = dynamic(() => import('@/components/map'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#F1EAE1]"></div>
    </div>
  )
})

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [communities, setCommunities] = useState<Community[]>([])
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null)
  const [selectedChain, setSelectedChain] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [mapHeight, setMapHeight] = useState('calc(100vh - 200px)'); // Default height
  const [currentMaxHeight, setCurrentMaxHeight] = useState<string | undefined>(undefined);
  const [currentMinHeight, setCurrentMinHeight] = useState<string | undefined>(undefined);
  
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

  useEffect(() => {
    const calculateDimensions = () => {
      if (typeof window !== 'undefined') {
        setMapHeight(window.innerWidth < 640 ? '100vw' : 'calc(100vh - 200px)'); // Changed 150vw to 100vw
        setCurrentMaxHeight(window.innerWidth < 640 ? '350px' : undefined);
        setCurrentMinHeight(window.innerWidth < 640 ? '200px' : undefined);
      }
    };
    calculateDimensions();
    // Optional: Add event listener for resize
    // window.addEventListener('resize', calculateDimensions);
    // return () => window.removeEventListener('resize', calculateDimensions);
  }, []);

  const filteredCommunities = selectedChain
    ? communities.filter(community => community.chain === selectedChain)
    : communities

  const communityGroups = filteredCommunities.reduce((acc, community) => {
    const region = REGION_MAPPING[community.country] || 'Other'
    if (!acc[region]) acc[region] = { countries: {} }
    if (!acc[region].countries[community.country]) acc[region].countries[community.country] = []
    acc[region].countries[community.country].push(community)
    return acc
  }, {} as Record<string, { countries: Record<string, Community[]> }>)

  // Add this console.log for debugging
  if (typeof window !== 'undefined') {
    console.log('Rendering Home - mapHeight:', mapHeight, 'maxHeight:', currentMaxHeight, 'minHeight:', currentMinHeight);
  }

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
      setIsSidebarOpen(false)
    }
  }

  const communityMetrics = Object.entries(communityGroups)
    .reduce((acc, [region, data]) => {
      const count = Object.values(data.countries).flat().length
      return [...acc, { region, count }]
    }, [] as Array<{ region: string, count: number }>)
    .sort((a, b) => b.count - a.count)

  return (
    <div className="snap-container bg-[#2A2D39]">
      <section className="snap-section relative">
        <div className="h-screen flex flex-col bg-[#2A2D39]">
          <div className="border-b border-[#F1EAE1]/20">
            <div className="px-4 sm:px-6 lg:px-8 py-4 pt-[env(safe-area-inset-top)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative text-center sm:text-left">
              <div className="w-8 h-8 mx-auto sm:mx-0">
                <img src="/images/Perfil.png" alt="Web3 Citizen Logo" className="w-full h-full object-contain" />
              </div>
              <div className="sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-[#F1EAE1]">ETH Communities</h1>
              </div>
              <div className="flex flex-col md:flex-row gap-2 px-4 md:px-8 mt-4">
                <div className="flex items-center gap-2 w-full md:w-auto">
                  {/* Hamburger menu, mobile only */}
                  {/*
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="block md:hidden text-[#F1EAE1] p-2 rounded-lg border border-[#F1EAE1]/20 bg-[#2A2D39]/50 hover:bg-[#2A2D39] transition hamburger"
                    aria-label="Open Search Options"
                    style={{ position: 'relative', top: '0.25rem' }}
                  >
                    <Menu className="h-6 w-6" />
                  </button>
                  */}
                  {/* Search bar */}
                  <div className="flex-1">
                    <SearchHeader 
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      communities={communities}
                      onSelectResult={handleSearchResult}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex min-h-0 relative overflow-hidden">
            {/* Overlay: must come before Sidebar for proper stacking */}
            {isSidebarOpen && (
              <div className="lg:hidden fixed inset-0 top-[88px] h-[calc(100%-88px)] bg-[#2A2D39]/95 z-40" />
            )}
            {/* Sidebar */}
            <div className={`fixed top-[88px] left-0 h-[calc(100%-88px)] w-64 z-50 transform transition-transform duration-300 ease-in-out 
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
              lg:relative lg:top-0 lg:h-full lg:w-64 lg:translate-x-0 lg:z-auto`}>
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
                  setIsSidebarOpen(false)
                }}
                isMobileOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
              />
            </div>

            <main className="flex-1 p-8 flex flex-col">
              <div className="container mx-auto">
              <div
                  className={`bg-[#2A2D39] rounded-xl shadow-lg border border-[#F1EAE1]/20 p-4 sm:p-6 transition-all duration-300 ease-in-out`}
                  style={{
                    height: mapHeight,
                    maxHeight: currentMaxHeight,
                    minHeight: currentMinHeight,
                  }}
                >
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
              Mapping the Ethereum Community
            </h2>
            <p className="mt-4 text-xl text-[#F1EAE1]/70">
              Explore meetups, projects, and builders in every region.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mx-auto max-w-2xl mt-8">
            <div className="text-center max-w-xs mx-auto bg-[#232533] rounded-xl shadow-md p-6 transition-transform hover:scale-105 hover:shadow-lg">
              <img src="/icons/EllipsesIcon.svg" alt="Global Network Icon" className="w-12 h-12 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-[#F1EAE1]">Global Network</h3>
              <p className="text-sm text-zinc-400 mt-1">Tap into communities across the globe.</p>
            </div>
            <div className="text-center max-w-xs mx-auto bg-[#232533] rounded-xl shadow-md p-6 transition-transform hover:scale-105 hover:shadow-lg">
              <img src="/icons/CirclesIcon.svg" alt="Community Built Icon" className="w-12 h-12 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-[#F1EAE1]">Community-Built</h3>
              <p className="text-sm text-zinc-400 mt-1">Submit your local crew and plant a flag.</p>
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
              40+ Communities Worldwide
            </h2>
            <p className="mt-4 text-xl text-[#F1EAE1]/70">
              Growing stronger across every continent <br />
              Register yours!
            </p>
          </div>

          <div className="mt-10 lg:mt-20">
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
                href="https://www.web3citizen.xyz" 
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