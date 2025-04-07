"use client"

import { useState } from 'react'
import { geocodeLocation } from '@/utils/geocoding'

export default function AddCommunity() {
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    twitter: '',
    country: '',
    city: '',
    chain: '',
    coordinates: {
      lat: '',
      lng: ''
    }
  })
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [geocodingError, setGeocodingError] = useState('')
  const [useManualCoordinates, setUseManualCoordinates] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'lat' || name === 'lng') {
      setFormData(prev => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [name]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleGeocodeClick = async () => {
    if (!formData.city || !formData.country) {
      setGeocodingError('Please enter both city and country')
      return
    }

    setIsGeocoding(true)
    setGeocodingError('')

    try {
      const coordinates = await geocodeLocation(formData.city, formData.country)
      if (coordinates) {
        setFormData(prev => ({
          ...prev,
          coordinates: {
            lat: coordinates.lat.toString(),
            lng: coordinates.lng.toString()
          }
        }))
        setGeocodingError('')
      } else {
        setGeocodingError('Could not find coordinates for this location')
      }
    } catch (error) {
      setGeocodingError('Error finding coordinates')
    } finally {
      setIsGeocoding(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would handle the form submission
    // This could involve sending the data to your API
    console.log('Form data:', formData)
  }

  return (
    <div className="min-h-screen bg-[#2A2D39] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#F1EAE1]">Add Your Community</h1>
          <p className="mt-2 text-[#F1EAE1]/70">Join the global Ethereum community network</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-[#2A2D39]/50 p-6 rounded-lg border border-[#F1EAE1]/20">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#F1EAE1]">
              Community Name *
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-[#2A2D39] border border-[#F1EAE1]/20 rounded-md text-[#F1EAE1] placeholder-[#F1EAE1]/50"
            />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-[#F1EAE1]">
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  id="country"
                  required
                  value={formData.country}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 bg-[#2A2D39] border border-[#F1EAE1]/20 rounded-md text-[#F1EAE1]"
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-[#F1EAE1]">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 bg-[#2A2D39] border border-[#F1EAE1]/20 rounded-md text-[#F1EAE1]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#F1EAE1]">Location Coordinates</span>
                <button
                  type="button"
                  onClick={() => setUseManualCoordinates(!useManualCoordinates)}
                  className="text-sm text-[#F1EAE1]/70 hover:text-[#F1EAE1]"
                >
                  {useManualCoordinates ? 'Use Automatic' : 'Enter Manually'}
                </button>
              </div>

              {useManualCoordinates ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="lat" className="block text-sm font-medium text-[#F1EAE1]">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="lat"
                      id="lat"
                      value={formData.coordinates.lat}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 bg-[#2A2D39] border border-[#F1EAE1]/20 rounded-md text-[#F1EAE1]"
                    />
                  </div>
                  <div>
                    <label htmlFor="lng" className="block text-sm font-medium text-[#F1EAE1]">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="lng"
                      id="lng"
                      value={formData.coordinates.lng}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 bg-[#2A2D39] border border-[#F1EAE1]/20 rounded-md text-[#F1EAE1]"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <button
                    type="button"
                    onClick={handleGeocodeClick}
                    disabled={isGeocoding || !formData.city || !formData.country}
                    className="w-full px-4 py-2 bg-[#F1EAE1] text-[#2A2D39] rounded-md hover:bg-[#F1EAE1]/90 disabled:opacity-50"
                  >
                    {isGeocoding ? 'Finding Location...' : 'Get Coordinates from City'}
                  </button>
                  {geocodingError && (
                    <p className="mt-2 text-sm text-red-500">{geocodingError}</p>
                  )}
                  {formData.coordinates.lat && formData.coordinates.lng && (
                    <p className="mt-2 text-sm text-[#F1EAE1]/70">
                      Found coordinates: {formData.coordinates.lat}, {formData.coordinates.lng}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="chain" className="block text-sm font-medium text-[#F1EAE1]">
              Chain (optional)
            </label>
            <input
              type="text"
              name="chain"
              id="chain"
              value={formData.chain}
              onChange={handleInputChange}
              placeholder="e.g., L2, Optimism"
              className="mt-1 block w-full px-3 py-2 bg-[#2A2D39] border border-[#F1EAE1]/20 rounded-md text-[#F1EAE1]"
            />
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-[#F1EAE1]">
              Website (optional)
            </label>
            <input
              type="url"
              name="website"
              id="website"
              value={formData.website}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-[#2A2D39] border border-[#F1EAE1]/20 rounded-md text-[#F1EAE1]"
            />
          </div>

          <div>
            <label htmlFor="twitter" className="block text-sm font-medium text-[#F1EAE1]">
              Twitter (optional)
            </label>
            <input
              type="url"
              name="twitter"
              id="twitter"
              value={formData.twitter}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-[#2A2D39] border border-[#F1EAE1]/20 rounded-md text-[#F1EAE1]"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-[#F1EAE1] text-[#2A2D39] rounded-md hover:bg-[#F1EAE1]/90"
            >
              Submit Community
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 