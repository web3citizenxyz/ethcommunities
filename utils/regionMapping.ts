export const REGIONS = [
  'North America',
  'South America',
  'Europe',
  'Asia',
  'Africa',
  'Oceania'
] as const

export const REGION_MAPPING: Record<string, string> = {
  // North America
  'USA': 'North America',
  'Canada': 'North America',
  'Mexico': 'North America',
  'El Salvador': 'North America',
  'Honduras': 'North America',

  // South America
  'Argentina': 'South America',
  'Brazil': 'South America',
  'Peru': 'South America',
  'Bolivia': 'South America',
  'Uruguay': 'South America',

  // Europe
  'Bulgaria': 'Europe',
  'Czech Republic': 'Europe',
  'England': 'Europe',
  'Estonia': 'Europe',
  'Ireland': 'Europe',
  'Italy': 'Europe',
  'Netherlands': 'Europe',
  'Poland': 'Europe',
  'Romania': 'Europe',
  'Serbia': 'Europe',
  'Turkey': 'Europe',

  // Asia
  'China': 'Asia',
  'Japan': 'Asia',
  'Taiwan': 'Asia',
  'UAE': 'Asia',
  'Saudi Arabia': 'Asia',

  // Africa
  'Nigeria': 'Africa',
  'Ethiopia': 'Africa',

  // Oceania
  'Australia': 'Oceania',
  'New Zealand': 'Oceania'
} 