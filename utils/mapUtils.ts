interface MapBounds {
  center: [number, number]
  zoom: number
}

const COUNTRY_BOUNDS: Record<string, MapBounds> = {
  'USA': {
    center: [39.8283, -98.5795],
    zoom: 4
  },
  'Spain': {
    center: [40.4637, -3.7492],
    zoom: 6
  },
  'Germany': {
    center: [51.1657, 10.4515],
    zoom: 6
  },
  'Argentina': {
    center: [-38.4161, -63.6167],
    zoom: 4
  },
  'Brazil': {
    center: [-14.2350, -51.9253],
    zoom: 4
  },
  'Canada': {
    center: [56.1304, -106.3468],
    zoom: 4
  },
  'Mexico': {
    center: [23.6345, -102.5528],
    zoom: 5
  }
}

export function getCountryBounds(country: string): MapBounds {
  return COUNTRY_BOUNDS[country] || { center: [0, 0], zoom: 2 }
}

export function getRegionBounds(region: string): MapBounds {
  const REGION_BOUNDS: Record<string, MapBounds> = {
    'North America': {
      center: [48.1667, -100.1667],
      zoom: 3
    },
    'South America': {
      center: [-15.7833, -47.8667],
      zoom: 3
    },
    'Europe': {
      center: [48.8566, 2.3522],
      zoom: 4
    },
    'Asia': {
      center: [34.0479, 100.6197],
      zoom: 3
    },
    'Africa': {
      center: [9.1450, 18.4277],
      zoom: 3
    },
    'Oceania': {
      center: [-25.2744, 133.7751],
      zoom: 4
    }
  }

  return REGION_BOUNDS[region] || { center: [0, 0], zoom: 2 }
}

export function getBoundsForCoordinates(lat: number, lng: number): MapBounds {
  return {
    center: [lat, lng],
    zoom: 12
  }
} 