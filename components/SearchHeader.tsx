"use client"

import { useRef } from 'react'
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { Community } from "@/types"
import { COUNTRY_COORDINATES } from "@/utils/geocoding"
import { useState, useCallback } from 'react'
import SearchDropdown from '@/components/SearchDropdown'

interface SearchHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  communities: Community[]
  onSelectResult: (result: { type: 'country' | 'community' | 'chain', value: string | Community }) => void
}

export default function SearchHeader({ 
  searchQuery, 
  onSearchChange,
  communities,
  onSelectResult
}: SearchHeaderProps) {
  const router = useRouter()
  const [showResults, setShowResults] = useState(false)
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
  const inputContainerRef = useRef<HTMLDivElement>(null)

  // Function to get unique chains from communities
  const getUniqueChains = useCallback(() => {
    const chains = new Set<string>()
    communities.forEach(community => {
      if (community.chain) {
        chains.add(community.chain)
      }
    })
    const uniqueChains = Array.from(chains)
    console.log('Available chains:', uniqueChains)
    return uniqueChains
  }, [communities])

  // Function to search countries, communities, and chains
  const getSearchResults = useCallback(() => {
    if (!localSearchQuery.trim()) return []

    const query = localSearchQuery.toLowerCase()
    console.log('Search query:', query)
    const results: Array<{ type: 'country' | 'community' | 'chain', value: string | Community }> = []

    // Search chains first
    getUniqueChains().forEach(chain => {
      if (chain.toLowerCase().includes(query)) {
        console.log('Found matching chain:', chain)
        results.push({ type: 'chain', value: chain })
      }
    })

    // Search communities
    communities.forEach(community => {
      if (
        community.name.toLowerCase().includes(query) ||
        community.country.toLowerCase().includes(query) ||
        (community.city && community.city.toLowerCase().includes(query)) ||
        (community.chain && community.chain.toLowerCase().includes(query))
      ) {
        console.log('Found matching community:', community)
        results.push({ type: 'community', value: community })
      }
    })

    // Search countries
    Object.keys(COUNTRY_COORDINATES).forEach(country => {
      if (country.toLowerCase().includes(query)) {
        results.push({ type: 'country', value: country })
      }
    })

    console.log('Search results:', results)
    return results
  }, [localSearchQuery, communities, getUniqueChains])

  const results = getSearchResults()

  const handleResultSelect = (result: { type: 'country' | 'community' | 'chain', value: string | Community }) => {
    onSelectResult(result)
    setShowResults(false)
    onSearchChange(result.type === 'community' 
      ? (result.value as Community).name 
      : result.value as string
    )
    setLocalSearchQuery('')
  }

  return (
    <div className="relative z-[9999]">
      <div className="flex items-center gap-4">
        <div ref={inputContainerRef} className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="search"
            placeholder="Search by country, community, or chain"
            className="w-[320px] pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 
              rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none 
              focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={localSearchQuery}
            onChange={(e) => {
              setLocalSearchQuery(e.target.value)
              setShowResults(true)
            }}
            onFocus={() => setShowResults(true)}
          />
          {showResults && results.length > 0 && (
            <div 
              style={{
                position: 'fixed',
                top: inputContainerRef.current ? 
                  inputContainerRef.current.getBoundingClientRect().bottom + 4 : 0,
                left: inputContainerRef.current ? 
                  inputContainerRef.current.getBoundingClientRect().left : 0,
                width: inputContainerRef.current ? 
                  inputContainerRef.current.offsetWidth : 320,
                zIndex: 9999,
              }}
              className="bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden"
            >
              <div className="max-h-[300px] overflow-y-auto">
                {results.map((result, index) => (
                  <button
                    key={index}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 
                      transition-colors duration-150 flex items-center justify-between
                      border-b border-gray-100 last:border-0"
                    onClick={() => handleResultSelect(result)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900 font-medium">
                        {result.type === 'community' 
                          ? (result.value as Community).name
                          : result.value as string}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                      {result.type === 'community' ? 'Community' : 'Country'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <Button 
          size="sm" 
          variant="outline"
          className="text-sm font-normal text-[#F1EAE1] border-[#F1EAE1]/20 
            hover:bg-[#2A2D39]/50 whitespace-nowrap"
          onClick={() => window.open('https://github.com/eugeniatel/ethcommunity', '_blank')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Community
        </Button>
      </div>
    </div>
  )
} 