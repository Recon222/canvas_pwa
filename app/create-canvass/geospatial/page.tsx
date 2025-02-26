"use client"

import { useEffect, useRef, useState } from "react"
import type React from "react"
import { useForm } from "../../contexts/form-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { MapPin, Save } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProgressBar } from "@/components/ui/progress-bar"
import "mapbox-gl/dist/mapbox-gl.css"

export default function GeospatialLocation() {
  const { formData, updateForm } = useForm()
  const router = useRouter()
  const mapContainer = useRef<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    // Dynamic import to ensure mapbox-gl is only loaded on the client side
    const initializeMap = async () => {
      if (mapLoaded) return
      
      try {
        const mapboxgl = (await import('mapbox-gl')).default
        
        // Check if the map container exists
        if (!mapContainer.current) return
        
        // Set the access token
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? ''
        
        // Create the map
        const map = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [-79.7624, 43.6532], // Default to Brampton/Mississauga area
          zoom: 10
        })
        
        // Add navigation controls
        map.addControl(new mapboxgl.NavigationControl(), 'top-right')
        
        // Set map loaded state
        map.on('load', () => {
          console.log('Map loaded successfully')
          setMapLoaded(true)
        })
        
        // Log any errors
        map.on('error', (e) => {
          console.error('Mapbox error:', e)
        })
        
        // Clean up on unmount
        return () => {
          map.remove()
        }
      } catch (error) {
        console.error('Error initializing map:', error)
      }
    }
    
    // Initialize the map after a short delay to ensure the container is rendered
    const timer = setTimeout(() => {
      initializeMap()
    }, 100)
    
    return () => {
      clearTimeout(timer)
    }
  }, [mapLoaded])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/create-canvass/completion")
  }

  const updateGeospatial = (field: string, value: string) => {
    updateForm({
      geospatial: {
        ...formData.geospatial,
        [field]: value,
      },
    })
  }

  const handleGeolocate = () => {
    // Placeholder for future geolocation implementation
    console.log("Geolocate clicked")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Banner with left-aligned logo and centered title */}
      <div className="m-4 bg-[#1e3a8a] rounded-lg">
        <div className="flex items-center p-4">
          <div className="w-10 h-10 relative">
            <Image src="/police-logo.png" alt="Police Logo" fill className="object-contain" priority />
          </div>
          <h1 className="flex-1 text-xl font-semibold text-white text-center">Geospatial Location Map</h1>
          <Save className="w-6 h-6 text-white" />
        </div>
        <ProgressBar progress={100} />
      </div>

      <div className="px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Map container */}
          <div 
            id="map"
            ref={mapContainer} 
            className="w-full h-[400px] rounded-lg border-2 border-[#1e3a8a]"
            style={{ position: 'relative' }}
          />

          <div className="flex gap-2 items-start">
            <div className="space-y-2 flex-1">
              <Label className="text-black">Address:</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter address"
                  value={formData.geospatial?.address || ""}
                  onChange={(e) => updateGeospatial("address", e.target.value)}
                  className="w-full border-2 border-[#1e3a8a] bg-white rounded"
                />
                <Button type="button" onClick={handleGeolocate} className="bg-[#1e3a8a] hover:bg-[#162c69]">
                  <MapPin className="w-4 h-4 mr-2" />
                  Geolocate
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Link href="/create-canvass/follow-up">
              <Button
                variant="outline"
                className="w-28 rounded-full border-2 border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
              >
                Back
              </Button>
            </Link>
            <Button type="submit" className="w-28 rounded-full bg-[#1e3a8a] text-white hover:bg-[#162c69]">
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

