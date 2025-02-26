"use client"

import { useRef } from 'react'
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { Community } from "@/types"
import { COUNTRY_COORDINATES } from "@/utils/geocoding"
import { useState, useCallback } from 'react'
import SearchDropdown from './SearchDropdown'

interface SearchHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  communities: Community[]
  onSelectResult: (result: { type: 'country' | 'community', value: string | Community }) => void
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

  // Función para buscar países y comunidades
  const getSearchResults = useCallback(() => {
    if (!localSearchQuery.trim()) return []

    const query = localSearchQuery.toLowerCase()
    const results: Array<{ type: 'country' | 'community', value: string | Community }> = []

    // Buscar países
    Object.keys(COUNTRY_COORDINATES).forEach(country => {
      if (country.toLowerCase().includes(query)) {
        results.push({ type: 'country', value: country })
      }
    })

    // Buscar comunidades
    communities.forEach(community => {
      if (
        community.name.toLowerCase().includes(query) ||
        community.country.toLowerCase().includes(query) ||
        (community.city && community.city.toLowerCase().includes(query))
      ) {
        results.push({ type: 'community', value: community })
      }
    })

    return results
  }, [localSearchQuery, communities])

  const results = getSearchResults()

  const handleResultSelect = (result: { type: 'country' | 'community', value: string | Community }) => {
    onSelectResult(result)
    setShowResults(false)
    onSearchChange(result.type === 'country' 
      ? result.value as string 
      : (result.value as Community).name
    )
    setLocalSearchQuery('')
  }

  return (
    <div className="relative z-[9999]">
      <div className="flex items-center gap-4">
        <div ref={inputContainerRef} className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search country or community"
            className="w-[280px] pl-9 pr-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            value={localSearchQuery}
            onChange={(e) => {
              setLocalSearchQuery(e.target.value)
              setShowResults(true)
            }}
            onFocus={() => setShowResults(true)}
          />
          {showResults && results.length > 0 && (
            <SearchDropdown
              results={results}
              onSelect={handleResultSelect}
              onClose={() => setShowResults(false)}
              inputRef={inputContainerRef}
            />
          )}
        </div>
        <Button 
          size="sm" 
          variant="outline"
          className="text-sm font-normal hover:bg-gray-50 whitespace-nowrap"
          onClick={() => router.push('/add-community')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Community
        </Button>
      </div>
    </div>
  )
} 