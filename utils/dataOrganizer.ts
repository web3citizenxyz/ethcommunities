import { Community, Region, Country } from '../types'
import { getCountryBounds } from './mapUtils'

const REGIONS_CONFIG = {
  'South America': {
    bounds: { center: [-15, -60] as [number, number], zoom: 3 },
    countries: ['Argentina', 'Brazil', 'Chile', 'Colombia', 'Peru']
  },
  'North America': {
    bounds: { center: [40, -100] as [number, number], zoom: 3 },
    countries: ['USA', 'Canada', 'Mexico']
  },
  'Europe': {
    bounds: { center: [50, 10] as [number, number], zoom: 4 },
    countries: ['Spain', 'France', 'Germany', 'UK', 'Italy']
  },
  'Asia': {
    bounds: { center: [34, 100] as [number, number], zoom: 3 },
    countries: ['China', 'Japan', 'South Korea', 'India']
  },
  'Oceania': {
    bounds: { center: [-25, 135] as [number, number], zoom: 4 },
    countries: ['Australia', 'New Zealand']
  }
} as const

function getCountryFromCoordinates(lat: number, lng: number): string {
  // Implementación básica - en producción deberías usar una API de geocodificación
  const COUNTRY_COORDINATES = {
    'USA': { minLat: 24.396308, maxLat: 49.384358, minLng: -125.000000, maxLng: -66.934570 },
    'Spain': { minLat: 36.000000, maxLat: 43.791300, minLng: -9.301758, maxLng: 4.327148 },
    // Añadir más países según sea necesario
  }

  for (const [country, bounds] of Object.entries(COUNTRY_COORDINATES)) {
    if (lat >= bounds.minLat && lat <= bounds.maxLat && 
        lng >= bounds.minLng && lng <= bounds.maxLng) {
      return country
    }
  }
  
  return 'Unknown'
}

export function organizeCommunitiesByRegion(communities: Community[]): Region[] {
  const communityByCountry = new Map<string, Community[]>()
  
  communities.forEach(community => {
    const country = getCountryFromCoordinates(community.latitude, community.longitude)
    if (!communityByCountry.has(country)) {
      communityByCountry.set(country, [])
    }
    communityByCountry.get(country)?.push(community)
  })

  return Object.entries(REGIONS_CONFIG).map(([regionName, config]) => {
    const countries: Country[] = config.countries.map(countryName => ({
      name: countryName,
      communities: communityByCountry.get(countryName) || [],
      bounds: getCountryBounds(countryName)
    })).filter(country => country.communities.length > 0)

    return {
      name: regionName,
      countries,
      bounds: config.bounds
    }
  }).filter(region => region.countries.length > 0)
} 