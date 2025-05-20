"use client"

import { X, Menu } from "lucide-react"
import { REGIONS } from "@/utils/regionMapping"
import { Community } from '@/types'

interface SidebarProps {
  communityGroups: Record<string, { countries: Record<string, Community[]> }>
  selectedRegion: string | null
  selectedCountry: string | null
  onRegionSelect: (region: string) => void
  onCountrySelect: (country: string) => void
  onCommunitySelect: (community: Community) => void
  isMobileOpen?: boolean
  onClose?: () => void
}

export default function Sidebar({
  communityGroups,
  selectedRegion,
  selectedCountry,
  onRegionSelect,
  onCountrySelect,
  onCommunitySelect,
  isMobileOpen = false,
  onClose = () => {}
}: SidebarProps) {
  return (
    <div
      className={`
        fixed top-[88px] left-0 h-[calc(100%-88px)] w-full max-w-[256px] z-50 transform transition-transform duration-300 ease-in-out
        bg-[#2A2D39]
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:top-0 lg:h-full lg:w-64 lg:max-w-none lg:translate-x-0 lg:z-auto
        lg:bg-transparent
      `}
    >
      <div className="flex flex-col h-full">
        <div className="lg:hidden p-4 flex justify-end">
          <button
            onClick={onClose}
            className="text-[#F1EAE1] text-xl hover:text-[#F1EAE1]/80"
          >
            <X />
          </button>
        </div>
        <div className="h-[88px] pt-4 px-4 hidden lg:block" />
        <div className="overflow-y-auto flex-1 pt-[49px]">
          {REGIONS.map((region) => {
            const regionData = communityGroups[region]
            const hasData = regionData && Object.keys(regionData.countries).length > 0

            return (
              <div key={region}>
                <button
                  className={`w-full text-left px-4 py-2 transition-colors duration-150
                    ${selectedRegion === region ? 'bg-[#2A2D39]/50 text-[#F1EAE1]' : 'text-[#F1EAE1]/70 '}
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
                                onClick={() => {
                                  onCommunitySelect(community)
                                  onClose()
                                }}
                                className="w-full text-left pl-12 pr-4 py-1.5 text-sm text-[#F1EAE1]/70 hover:bg-[#2A2D39] transition-colors duration-150"
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
    </div>
  )
}
