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
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css"
// Import types only (not the actual module)
import type mapboxgl from "mapbox-gl"

export default function GeospatialLocation() {
  const { formData, updateForm } = useForm()
  const router = useRouter()
  const mapContainer = useRef<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [currentMarker, setCurrentMarker] = useState<any>(null)

  useEffect(() => {
    // Dynamic import to ensure mapbox-gl is only loaded on the client side
    const initializeMap = async () => {
      if (mapLoaded) return
      
      try {
        const mapboxgl = (await import('mapbox-gl')).default
        const MapboxGeocoder = (await import('@mapbox/mapbox-gl-geocoder')).default
        
        // Check if the map container exists
        if (!mapContainer.current) return
        
        // Set the access token
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? ''
        
        // Create the map
        const map = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [-79.7624, 43.6532], // Default to Brampton/Mississauga area
          zoom: 10,
          preserveDrawingBuffer: true // Add this to prevent canvas clearing
        })
        
        // Add navigation controls
        map.addControl(new mapboxgl.NavigationControl(), 'top-right')
        
        // Initialize the geocoder
        const geocoder = new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl: mapboxgl,
          marker: false, // We'll handle the marker ourselves
          placeholder: 'Search for addresses in Ontario',
          countries: 'ca', // Limit to Canada
          bbox: [-95.1562, 41.6751, -74.3364, 56.8613], // Rough bounding box for Ontario
          filter: function(item) {
            // Filter to only show results in Ontario
            return item.context?.some(context => {
              return (
                context.id.startsWith('region') && 
                context.text === 'Ontario'
              )
            })
          }
        })
        
        // Add the geocoder to the map
        map.addControl(geocoder, 'top-left')
        
        // Add a source for the single point marker
        map.on('load', () => {
          // Add source only if it doesn't exist yet
          if (!map.getSource('single-point')) {
            map.addSource('single-point', {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: []
              }
            })
            
            map.addLayer({
              id: 'point',
              source: 'single-point',
              type: 'circle',
              paint: {
                'circle-radius': 10,
                'circle-color': '#1e3a8a',
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff'
              }
            })
          }
          
          console.log('Map loaded successfully')
          setMapLoaded(true)
        })
        
        // Listen for the geocoder result event
        geocoder.on('result', (event) => {
          try {
            // Update the marker on the map
            // @ts-ignore - Mapbox types don't properly recognize setData on GeoJSON sources
            map.getSource('single-point').setData(event.result.geometry)
            
            // Update the form with the selected address
            const address = event.result.place_name
            
            // Store coordinates in the form
            const [longitude, latitude] = event.result.center
            
            // Update form state in a single operation
            updateForm({
              geospatial: {
                ...formData.geospatial,
                address: address,
                longitude: longitude,
                latitude: latitude
              }
            })
            
            // Center the map on the selected location
            map.flyTo({
              center: [longitude, latitude],
              zoom: 15,
              essential: true
            })
          } catch (error) {
            console.error('Error handling geocoder result:', error)
          }
        })
        
        // Handle click on map to set marker
        map.on('click', (e) => {
          try {
            const { lng, lat } = e.lngLat
            
            // Update the marker
            // @ts-ignore - Mapbox types don't properly recognize setData on GeoJSON sources
            map.getSource('single-point').setData({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [lng, lat]
              },
              properties: {}
            })
            
            // Reverse geocode to get address
            reverseGeocode(lng, lat, mapboxgl.accessToken)
              .then(address => {
                updateForm({
                  geospatial: {
                    ...formData.geospatial,
                    address: address,
                    longitude: lng,
                    latitude: lat
                  }
                })
              })
              .catch(error => {
                console.error('Error reverse geocoding:', error)
              })
          } catch (error) {
            console.error('Error handling map click:', error)
          }
        })
        
        // Log any errors
        map.on('error', (e) => {
          console.error('Mapbox error:', e)
        })
        
        // Store map reference for cleanup
        setCurrentMarker(map)
        
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
      if (currentMarker) {
        currentMarker.remove()
      }
    }
  }, []) // Remove dependencies to prevent re-initialization

  // Function to reverse geocode coordinates to address
  const reverseGeocode = async (lng: number, lat: number, accessToken: string) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}&country=ca&types=address`
      )
      const data = await response.json()
      
      if (data.features && data.features.length > 0) {
        return data.features[0].place_name
      }
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    } catch (error) {
      console.error('Error in reverse geocoding:', error)
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    }
  }

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
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser")
      return
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        // Update the map marker if map is loaded
        if (currentMarker && mapLoaded) {
          try {
            // Get the source from the map
            const source = currentMarker.getSource('single-point')
            if (source) {
              // @ts-ignore - Mapbox types don't properly recognize setData on GeoJSON sources
              source.setData({
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [longitude, latitude]
                },
                properties: {}
              })
            }
            
            // Center the map on the location
            currentMarker.flyTo({
              center: [longitude, latitude],
              zoom: 15,
              essential: true
            })
            
            // Get the address from coordinates
            const accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? ''
            const address = await reverseGeocode(longitude, latitude, accessToken)
            
            // Update form with location data
            updateForm({
              geospatial: {
                ...formData.geospatial,
                address: address,
                longitude: longitude,
                latitude: latitude
              }
            })
          } catch (error) {
            console.error('Error updating map with geolocation:', error)
          }
        }
      },
      (error) => {
        console.error("Error getting location:", error)
        alert(`Error getting your location: ${error.message}`)
      }
    )
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

