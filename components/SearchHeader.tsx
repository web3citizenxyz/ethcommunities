"use client"

import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function SearchHeader({ searchQuery, onSearchChange }: SearchHeaderProps) {
  return (
    <div className="h-12 border-b flex items-center justify-between px-4 bg-white shadow-sm">
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder="Search country or community"
          className="w-full pl-9 pr-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button 
        size="sm" 
        variant="outline"
        className="text-sm font-normal ml-4 hover:bg-gray-50"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Community
      </Button>
    </div>
  )
} 