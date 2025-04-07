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
    <div className="w-64 bg-[#2A2D39] border-r border-[#F1EAE1]/20 flex flex-col">
      <div className="h-[88px] pt-4 px-4">
        {/* Espacio vacío que coincide con el header */}
      </div>
      <div className="overflow-y-auto flex-1 pt-[49px]">
        {REGIONS.map((region) => {
          const regionData = communityGroups[region]
          const hasData = regionData && Object.keys(regionData.countries).length > 0

          return (
            <div key={region} className="border-b border-[#F1EAE1]/10 last:border-0">
              <button
                className={`w-full text-left px-4 py-2 transition-colors duration-150
                  ${selectedRegion === region ? 'bg-[#2A2D39]/50 text-[#F1EAE1]' : 'text-[#F1EAE1]/70'}
                  ${!hasData ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#2A2D39]/50'}`}
                onClick={() => onRegionSelect(region)}
                disabled={!hasData}
              >
                <span className="text-sm">{region}</span>
              </button>

              {selectedRegion === region && hasData && (
                <div className="bg-[#2A2D39]/30 pb-1">
                  {Object.entries(regionData.countries).map(([country, communities]) => (
                    <div key={country}>
                      <button
                        className={`w-full text-left pl-8 pr-4 py-1.5 transition-colors duration-150
                          ${selectedCountry === country ? 'bg-[#2A2D39]/70' : 'hover:bg-[#2A2D39]/70'}`}
                        onClick={() => onCountrySelect(country)}
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#F1EAE1]">{country}</span>
                          <span className="text-xs text-[#F1EAE1]/70 bg-[#2A2D39] px-1.5 py-0.5 rounded">
                            {communities.length}
                          </span>
                        </div>
                      </button>

                      {selectedCountry === country && (
                        <div className="bg-[#2A2D39]/70">
                          {communities.map((community) => (
                            <button
                              key={community.name}
                              onClick={() => onCommunitySelect(community)}
                              className="w-full text-left pl-12 pr-4 py-1.5 text-sm text-[#F1EAE1]/70
                                hover:bg-[#2A2D39] transition-colors duration-150"
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