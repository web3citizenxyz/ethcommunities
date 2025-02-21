"use client"

import { useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Globe, List, Plus, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

// Fix for default marker icons in Leaflet with Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = icon

interface Community {
  name: string
  country: string
  count: number
}

const communities: Record<string, Community[]> = {
  "South America": [
    { name: "Argentina", country: "Argentina", count: 2 },
    { name: "Brazil", country: "Brazil", count: 2 },
  ],
  "North America": [
    { name: "USA", country: "USA", count: 2 },
    { name: "Canada", country: "Canada", count: 2 },
  ],
}

export default function Home() {
  const [showMap, setShowMap] = useState(true)

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r bg-background">
        <div className="flex items-center gap-2 p-4 border-b">
          <Globe className="w-5 h-5" />
          <h1 className="font-semibold">Communities</h1>
        </div>
        <ScrollArea className="h-[calc(100vh-57px)]">
          <div className="p-4">
            {Object.entries(communities).map(([region, communities]) => (
              <div key={region} className="mb-6">
                <h2 className="text-sm font-semibold text-muted-foreground mb-2">{region}</h2>
                {communities.map((community) => (
                  <div
                    key={community.name}
                    className="flex items-center justify-between py-2 px-2 hover:bg-accent rounded-md cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span>{community.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{community.count}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="border-b bg-background">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-semibold">Ethereum Communities</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowMap(!showMap)}>
                {showMap ? <List className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                {showMap ? "List View" : "Map View"}
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Community
              </Button>
              <Button variant="ghost" size="icon">
                <Sun className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4">
          {showMap ? (
            <div className="h-full w-full rounded-lg overflow-hidden border">
              <MapContainer center={[20, 0]} zoom={2} style={{ height: "100%", width: "100%" }} zoomControl={false}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[51.505, -0.09]}>
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          ) : (
            <div className="grid gap-4">
              {Object.entries(communities).map(([region, communities]) => (
                <div key={region}>
                  <h2 className="text-lg font-semibold mb-2">{region}</h2>
                  <div className="grid gap-2">
                    {communities.map((community) => (
                      <div key={community.name} className="p-4 border rounded-lg hover:bg-accent">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{community.name}</h3>
                          <span className="text-sm text-muted-foreground">{community.count} communities</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

