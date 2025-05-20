import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google"
import "../app/globals.css"
import 'leaflet/dist/leaflet.css'


const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '700'] })
const inter = Inter({ subsets: ['latin'], weight: ['400', '700'] })

export const metadata: Metadata = {
  title: "Ethereum Communities",
  description: "A map of Ethereum communities around the world",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Ethereum Communities</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="/css/leaflet/MarkerCluster.css" />
        <link rel="stylesheet" href="/css/leaflet/MarkerCluster.Default.css" />
        <link rel="stylesheet" href="/css/styles.css" />
        <script src="https://unpkg.com/lucide@latest"></script>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className={montserrat.className}>
        {children}
        <script src="/js/leaflet/leaflet.markercluster-src.js" defer></script>
        <script src="/js/app.js" defer></script>
      </body>
    </html>
  )
}

