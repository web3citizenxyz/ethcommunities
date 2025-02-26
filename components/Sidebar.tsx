"use client"

import { Globe } from "lucide-react"
import { REGIONS } from "@/utils/regionMapping"
import { Community } from '@/types'

interface SidebarProps {
  communityGroups: Record<string, { countries: Record<string, Community[]> }>
  selectedRegion: string | null
  selectedCountry: string | null
  onRegionSelect: (region: string) => void
  onCountrySelect: (country: string) => void
  onCommunitySelect: (community: Community) => void
}

export default function Sidebar({
  communityGroups,
  selectedRegion,
  selectedCountry,
  onRegionSelect,
  onCountrySelect,
  onCommunitySelect
}: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r">
      <div className="p-3 border-b flex items-center">
        <Globe className="w-4 h-4 mr-2" />
        <span className="font-medium">ETH Communities</span>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-48px)]">
        {REGIONS.map((region) => {
          const regionData = communityGroups[region]
          const hasData = regionData && Object.keys(regionData.countries).length > 0

          return (
            <div key={region}>
              <button
                className={`w-full text-left px-4 py-1.5 hover:bg-gray-50 ${
                  selectedRegion === region ? 'bg-gray-50' : ''
                } ${!hasData ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => onRegionSelect(region)}
                disabled={!hasData}
              >
                <span className="text-sm">{region}</span>
              </button>

              {selectedRegion === region && hasData && (
                <div>
                  {Object.entries(regionData.countries).map(([country, communities]) => (
                    <div key={country}>
                      <button
                        className={`w-full text-left pl-8 pr-4 py-1 hover:bg-gray-50 ${
                          selectedCountry === country ? 'bg-gray-50' : ''
                        }`}
                        onClick={() => onCountrySelect(country)}
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span>{country}</span>
                          <span className="text-xs text-gray-400">({communities.length})</span>
                        </div>
                      </button>

                      {selectedCountry === country && (
                        <div>
                          {communities.map((community) => (
                            <button
                              key={community.name}
                              onClick={() => onCommunitySelect(community)}
                              className="w-full text-left pl-12 pr-4 py-1 hover:bg-gray-50 text-sm text-gray-500"
                            >
                              {community.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
} 