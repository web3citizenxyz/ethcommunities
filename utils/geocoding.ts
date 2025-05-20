import { Community } from '@/types'

export const COUNTRY_COORDINATES: Record<string, [number, number]> = {
  // North America
  'USA': [39.8283, -98.5795],
  'Canada': [56.1304, -106.3468],
  'Mexico': [23.6345, -102.5528],
  'El Salvador': [13.7942, -88.8965],
  'Honduras': [15.2000, -86.2419],

  // South America
  'Argentina': [-38.4161, -63.6167],
  'Brazil': [-14.2350, -51.9253],
  'Peru': [-9.1900, -75.0152],
  'Bolivia': [-16.2902, -63.5887],
  'Uruguay': [-32.5228, -55.7658],

  // Europe
  'Bulgaria': [42.7339, 25.4858],
  'Czech Republic': [49.8175, 15.4730],
  'England': [52.3555, -1.1743],
  'Estonia': [58.5953, 25.0136],
  'Ireland': [53.1424, -7.6921],
  'Italy': [41.8719, 12.5674],
  'Netherlands': [52.1326, 5.2913],
  'Poland': [51.9194, 19.1451],
  'Romania': [45.9432, 24.9668],
  'Serbia': [44.0165, 21.0059],
  'Turkey': [38.9637, 35.2433],

  // Asia
  'China': [35.8617, 104.1954],
  'Japan': [36.2048, 138.2529],
  'Taiwan': [23.5937, 120.9221],
  'UAE': [23.4241, 53.8478],
  'Saudi Arabia': [23.8859, 45.0792],

  // Africa
  'Nigeria': [9.0820, 8.6753],
  'Ethiopia': [9.1450, 40.4897],

  // Oceania
  'Australia': [-25.2744, 133.7751],
  'New Zealand': [-40.9006, 174.8860]
}

export async function geocodeLocation(city: string, country: string): Promise<{ lat: number; lng: number } | null> {
  try {
    // Add a delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` + 
      `city=${encodeURIComponent(city)}&` +
      `country=${encodeURIComponent(country)}&` +
      `format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'ETHCommunity/1.0'
        }
      }
    );

    const data = await response.json();
    
    if (data[0]) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
} 

export async function getCommunityCoordinates(community: Community) {
  const city = community.city ?? ''
  const country = community.country
  const coords = await geocodeLocation(city, country)

  if (!coords) {
    throw new Error(`No coordinates found for ${community.name}`)
  }

  return coords
}