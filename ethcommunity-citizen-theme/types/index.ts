export interface Community {
  name: string;
  website?: string;
  description?: string;
  twitter?: string;
  country: string;
  city?: string;
  chain?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface CommunityGroup {
  countries: Record<string, Community[]>;
}

export interface SidebarProps {
  communityGroups: Record<string, CommunityGroup>;
  selectedRegion: string | null;
  selectedCountry: string | null;
  onRegionSelect: (region: string) => void;
  onCountrySelect: (country: string) => void;
  onCommunitySelect: (community: Community) => void;
}

export interface Country {
  name: string;
  communities: Community[];
  bounds: {
    center: [number, number];
    zoom: number;
  };
}

export interface Region {
  name: string;
  countries: Country[];
  bounds: {
    center: [number, number];
    zoom: number;
  };
} 