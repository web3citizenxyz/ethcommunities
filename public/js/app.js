// Import Leaflet library
import * as L from "leaflet"
import * as lucide from "lucide"

// DOM Elements
const mapView = document.getElementById("map-view")
const listView = document.getElementById("list-view")
const viewToggle = document.getElementById("viewToggle")
const addCommunityBtn = document.getElementById("addCommunity")
const addCommunityModal = document.getElementById("addCommunityModal")
const cancelAddBtn = document.getElementById("cancelAdd")
const communityForm = document.getElementById("communityForm")
const themeToggle = document.getElementById("themeToggle")
const sidebarCommunities = document.getElementById("sidebar-communities")

// State
let showMap = true
let communities = {}
let map

// Initialize map
function initMap() {
  map = L.map("map-view").setView([20, 0], 2)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map)
}

// Toggle view
viewToggle.addEventListener("click", () => {
  showMap = !showMap
  mapView.style.display = showMap ? "block" : "none"
  listView.style.display = showMap ? "none" : "block"
  viewToggle.innerHTML = showMap
    ? '<i data-lucide="list" class="w-4 h-4"></i><span>List View</span>'
    : '<i data-lucide="map" class="w-4 h-4"></i><span>Map View</span>'
  lucide.createIcons()
})

// Modal handlers
addCommunityBtn.addEventListener("click", () => {
  addCommunityModal.classList.remove("hidden")
})

cancelAddBtn.addEventListener("click", () => {
  addCommunityModal.classList.add("hidden")
  communityForm.reset()
})

// Theme toggle
themeToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark")
  const isDark = document.documentElement.classList.contains("dark")
  themeToggle.innerHTML = isDark
    ? '<i data-lucide="moon" class="w-4 h-4"></i>'
    : '<i data-lucide="sun" class="w-4 h-4"></i>'
  lucide.createIcons()
})

// Load and organize communities
async function loadCommunities() {
  try {
    const response = await fetch("communities.json")
    const data = await response.json()

    // Organize by continent
    communities = data.reduce((acc, community) => {
      const continent = getContinent(community.country)
      if (!acc[continent]) {
        acc[continent] = {}
      }
      if (!acc[continent][community.country]) {
        acc[continent][community.country] = []
      }
      acc[continent][community.country].push(community)
      return acc
    }, {})

    renderSidebar()
    renderListView()
    addMarkersToMap()
  } catch (error) {
    console.error("Error loading communities:", error)
  }
}

// Render sidebar
function renderSidebar() {
  let html = ""
  for (const [continent, countries] of Object.entries(communities)) {
    html += `
            <div class="mb-6 px-4">
                <h2 class="text-sm font-semibold text-gray-500 mb-2">${continent}</h2>
                ${Object.entries(countries)
                  .map(
                    ([country, communities]) => `
                    <div class="flex items-center justify-between py-2 px-2 hover:bg-gray-50 rounded-md cursor-pointer">
                        <div class="flex items-center gap-2">
                            <i data-lucide="map-pin" class="w-4 h-4 text-gray-500"></i>
                            <span>${country}</span>
                        </div>
                        <span class="text-sm text-gray-500">${communities.length}</span>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        `
  }
  sidebarCommunities.innerHTML = html
  lucide.createIcons()
}

// Render list view
function renderListView() {
  let html = ""
  for (const [continent, countries] of Object.entries(communities)) {
    html += `
            <div>
                <h2 class="text-lg font-semibold mb-2">${continent}</h2>
                <div class="grid gap-2">
                    ${Object.entries(countries)
                      .map(
                        ([country, communities]) => `
                        <div class="p-4 border rounded-lg hover:bg-gray-50">
                            <div class="flex items-center justify-between">
                                <h3 class="font-medium">${country}</h3>
                                <span class="text-sm text-gray-500">${communities.length} communities</span>
                            </div>
                            <div class="mt-2 space-y-2">
                                ${communities
                                  .map(
                                    (community) => `
                                    <div class="ml-4">
                                        <div class="font-medium">${community.name}</div>
                                        <div class="text-sm text-gray-500">
                                            ${community.city ? `${community.city}, ` : ""}${community.country}
                                        </div>
                                    </div>
                                `,
                                  )
                                  .join("")}
                            </div>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
        `
  }
  listView.innerHTML = html
}

// Add markers to map
async function addMarkersToMap() {
  for (const [continent, countries] of Object.entries(communities)) {
    for (const [country, communityList] of Object.entries(countries)) {
      for (const community of communityList) {
        if (!community.latitude || !community.longitude) {
          const coords = await fetchCoordinates(community.city, community.country)
          if (coords) {
            community.latitude = coords.latitude
            community.longitude = coords.longitude
          } else {
            continue
          }
        }

        L.marker([community.latitude, community.longitude])
          .addTo(map)
          .bindPopup(`
                        <b>${community.name}</b><br>
                        <a href="${community.website}" target="_blank">Website</a><br>
                        ${community.twitter ? `<a href="${community.twitter}" target="_blank">Twitter</a><br>` : ""}
                        ${community.city ? `City: ${community.city}<br>` : ""}
                        Country: ${community.country}
                    `)
      }
    }
  }
}

// Helper function to get coordinates
async function fetchCoordinates(city, country) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)},${encodeURIComponent(country)}`,
    )
    const data = await response.json()
    if (data.length > 0) {
      return {
        latitude: Number.parseFloat(data[0].lat),
        longitude: Number.parseFloat(data[0].lon),
      }
    }
  } catch (error) {
    console.error(`Error fetching coordinates for ${city}, ${country}:`, error)
  }
  return null
}

// Helper function to determine continent
function getContinent(country) {
  const continents = {
    "North America": ["USA", "Canada", "Mexico"],
    "South America": ["Argentina", "Brazil", "Chile", "Colombia", "Peru", "Venezuela", "Bolivia", "Uruguay"],
    Europe: [
      "UK",
      "France",
      "Germany",
      "Italy",
      "Spain",
      "Netherlands",
      "Bulgaria",
      "Romania",
      "Poland",
      "Ireland",
      "Estonia",
      "Serbia",
      "Turkey",
      "Czech Republic",
      "England",
    ],
    Africa: ["Nigeria", "Ethiopia", "South Africa", "Kenya", "Egypt", "Morocco", "Ghana"],
    Asia: ["China", "Japan", "India", "South Korea", "Singapore", "Thailand", "UAE", "Saudi Arabia", "Taiwan"],
    Oceania: ["Australia", "New Zealand"],
  }

  for (const [continent, countries] of Object.entries(continents)) {
    if (countries.includes(country)) {
      return continent
    }
  }
  return "Other"
}

// Form submission
communityForm.addEventListener("submit", async (e) => {
  e.preventDefault()
  const formData = new FormData(communityForm)
  const newCommunity = Object.fromEntries(formData.entries())

  const coords = await fetchCoordinates(newCommunity.city, newCommunity.country)
  if (coords) {
    newCommunity.latitude = coords.latitude
    newCommunity.longitude = coords.longitude

    // Add to communities object
    const continent = getContinent(newCommunity.country)
    if (!communities[continent]) {
      communities[continent] = {}
    }
    if (!communities[continent][newCommunity.country]) {
      communities[continent][newCommunity.country] = []
    }
    communities[continent][newCommunity.country].push(newCommunity)

    // Update UI
    renderSidebar()
    renderListView()
    addMarkersToMap()

    // Close modal and reset form
    addCommunityModal.classList.add("hidden")
    communityForm.reset()
  } else {
    alert("Could not find coordinates for the given city and country. Please check your input.")
  }
})

// Initialize
initMap()
loadCommunities()

