"use client"

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Community } from '@/types'

interface SearchDropdownProps {
  results: Array<{ type: 'country' | 'community', value: string | Community }>
  onSelect: (result: { type: 'country' | 'community', value: string | Community }) => void
  onClose: () => void
  inputRef: React.RefObject<HTMLDivElement>
}

export default function SearchDropdown({ results, onSelect, onClose, inputRef }: SearchDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function updatePosition() {
      if (!dropdownRef.current || !inputRef.current) return
      const rect = inputRef.current.getBoundingClientRect()
      dropdownRef.current.style.position = 'fixed'
      dropdownRef.current.style.top = `${rect.bottom + 4}px`
      dropdownRef.current.style.left = `${rect.left}px`
      dropdownRef.current.style.width = `${rect.width}px`
    }

    updatePosition()
    window.addEventListener('scroll', updatePosition)
    window.addEventListener('resize', updatePosition)

    return () => {
      window.removeEventListener('scroll', updatePosition)
      window.removeEventListener('resize', updatePosition)
    }
  }, [inputRef])

  return createPortal(
    <>
      <div 
        className="fixed inset-0 bg-transparent" 
        onClick={onClose}
      />
      <div 
        ref={dropdownRef}
        className="bg-white rounded-md shadow-lg border max-h-64 overflow-y-auto"
      >
        {results.map((result, index) => (
          <button
            key={index}
            className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between"
            onClick={() => onSelect(result)}
          >
            {result.type === 'country' ? (
              <>
                <span className="text-gray-600">{result.value as string}</span>
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">Country</span>
              </>
            ) : (
              <>
                <div>
                  <div className="text-gray-900">{(result.value as Community).name}</div>
                  <div className="text-xs text-gray-500">{(result.value as Community).country}</div>
                </div>
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">Community</span>
              </>
            )}
          </button>
        ))}
      </div>
    </>,
    document.body
  )
} 