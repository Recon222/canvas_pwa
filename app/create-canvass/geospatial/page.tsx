"use client"

import { useEffect, useRef, useState } from "react"
import type React from "react"
import { useForm } from "../../contexts/form-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { MapPin, Save, X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProgressBar } from "@/components/ui/progress-bar"
import "mapbox-gl/dist/mapbox-gl.css"
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css"
// Import mapboxgl for use in the component
import mapboxgl from "mapbox-gl"
// Import marker utilities
import { createMarker, storeMarker, MarkerData } from "../../lib/marker-utils"

export default function GeospatialLocation() {
  const { formData, updateForm } = useForm()
  const router = useRouter()
  const mapContainer = useRef<any>(null)
  const geocoderContainer = useRef<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [currentMarker, setCurrentMarker] = useState<any>(null)
  const [currentMarkerData, setCurrentMarkerData] = useState<MarkerData | null>(null)
  const [mapInstance, setMapInstance] = useState<any>(null)
  const [geocoder, setGeocoder] = useState<any>(null)
  const [showStreetView, setShowStreetView] = useState(false)
  const [streetViewCoords, setStreetViewCoords] = useState<{lat: number, lng: number} | null>(null)

  useEffect(() => {
    // Dynamic import to ensure mapbox-gl is only loaded on the client side
    const initializeMap = async () => {
      if (mapLoaded) return
      
      try {
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
          preserveDrawingBuffer: true, // Add this to prevent canvas clearing
          attributionControl: false // Disable default attribution control
        })
        
        // Store map reference
        setMapInstance(map)
        
        // Add navigation controls
        map.addControl(new mapboxgl.NavigationControl(), 'top-right')
        
        // Initialize the geocoder
        const geocoderInstance = new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl: mapboxgl,
          marker: false, // We'll handle the marker ourselves
          placeholder: 'Search for addresses in Ontario',
          countries: 'ca', // Limit to Canada
          bbox: [-95.1562, 41.6751, -74.3364, 56.8613], // Rough bounding box for Ontario,
          flyTo: false, // Disable automatic flying to result
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
        
        // Store geocoder for later use
        setGeocoder(geocoderInstance)
        
        // Add the geocoder to the container instead of the map
        if (geocoderContainer.current) {
          geocoderContainer.current.appendChild(geocoderInstance.onAdd(map))
        }
        
        // Create a default marker element with custom color
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';
        
        // Function to create a new marker
        const createMapMarker = (lngLat: { lng: number; lat: number }, address?: string, abbreviatedAddress?: string) => {
          // Remove existing marker if it exists
          if (currentMarker) {
            currentMarker.remove();
          }
          
          // Create marker data with UUID
          const markerData = createMarker(
            lngLat.lat,
            lngLat.lng,
            {
              address,
              abbreviatedAddress,
              type: 'canvass',
              metadata: {
                formId: formData.id
              }
            }
          );
          
          // Store marker data
          storeMarker(markerData);
          setCurrentMarkerData(markerData);
          
          // Create a custom marker instance
          const marker = new mapboxgl.Marker({
            color: '#4285F4', // Lighter blue color
            scale: 1.2 // Slightly larger than default
          });
          
          // Create a popup for the marker
          const popup = new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: false,
            maxWidth: '300px'
          });
          
          // Add the marker to the map
          marker.setLngLat(lngLat).addTo(map);
          
          // Add popup to marker with content
          popup.setHTML(`
            <div style="padding: 8px;">
              <p><strong>ID:</strong> ${markerData.id.substring(0, 8)}...</p>
              <p><strong>Created:</strong> ${new Date(markerData.createdAt).toLocaleString()}</p>
              <p><strong>Coordinates:</strong> ${lngLat.lat.toFixed(6)}, ${lngLat.lng.toFixed(6)}</p>
              <button id="street-view-btn" style="background-color: #4285F4; color: white; border: none; padding: 6px 12px; border-radius: 4px; margin-top: 8px; cursor: pointer; width: 100%;">
                Open Google Street View
              </button>
            </div>
          `);
          marker.setPopup(popup);
          
          // Add event listener for Street View button
          marker.getElement().addEventListener('click', () => {
            setTimeout(() => {
              const streetViewBtn = document.getElementById('street-view-btn');
              if (streetViewBtn) {
                streetViewBtn.addEventListener('click', (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setStreetViewCoords({
                    lat: marker.getLngLat().lat,
                    lng: marker.getLngLat().lng
                  });
                  setShowStreetView(true);
                  marker.togglePopup(); // Close the popup
                });
              }
            }, 100); // Small delay to ensure the popup is rendered
          });
          
          // Store the marker for later use
          setCurrentMarker(marker);
          
          // Update form state with marker data
          updateForm({
            geospatial: {
              ...formData.geospatial,
              address: address || '',
              abbreviatedAddress: abbreviatedAddress || '',
              longitude: lngLat.lng,
              latitude: lngLat.lat,
              markerId: markerData.id
            }
          });
          
          return marker;
        };
        
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
          }
          
          // Don't create a marker on load - wait for user interaction
          console.log('Map loaded successfully')
          setMapLoaded(true)
        })
        
        // Listen for the geocoder result event
        geocoderInstance.on('result', (event) => {
          try {
            // Get coordinates from the result
            const [longitude, latitude] = event.result.center
            
            // Create or update marker
            createMapMarker({ lng: longitude, lat: latitude }, event.result.place_name, abbreviateAddress(event.result.place_name))
            
            // Update the geocoder input with the abbreviated address
            if (geocoderInstance && geocoderInstance._inputEl) {
              geocoderInstance._inputEl.value = abbreviateAddress(event.result.place_name)
            }
            
            // Center the map on the selected location with a smooth animation
            map.flyTo({
              center: [longitude, latitude],
              zoom: 15,
              essential: true,
              speed: 0.8, // Slower animation
              curve: 1 // Linear animation
            })
          } catch (error) {
            console.error('Error handling geocoder result:', error)
          }
        })
        
        // Note: Map click event listener has been commented out to prevent creating new markers when clicking on the map
        // The user can still interact with existing markers and see their popups
        // Uncomment this section when you want to enable creating markers by clicking on the map
        /*
        // Handle click on map to set marker
        map.on('click', (e) => {
          try {
            const { lng, lat } = e.lngLat
            
            // Create or update marker
            createMapMarker({ lng, lat });
            
            // Reverse geocode to get address
            reverseGeocode(lng, lat, mapboxgl.accessToken)
              .then(address => {
                const abbreviatedAddress = abbreviateAddress(address)
                updateForm({
                  geospatial: {
                    ...formData.geospatial,
                    address: address,
                    abbreviatedAddress: abbreviatedAddress,
                    longitude: lng,
                    latitude: lat
                  }
                })
                
                // Update the geocoder input with the abbreviated address
                if (geocoderInstance && geocoderInstance._inputEl) {
                  geocoderInstance._inputEl.value = abbreviatedAddress
                }
              })
              .catch(error => {
                console.error('Error reverse geocoding:', error)
              })
          } catch (error) {
            console.error('Error handling map click:', error)
          }
        })
        */
        
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
      if (currentMarker) {
        currentMarker.remove();
      }
      if (mapInstance) {
        mapInstance.remove();
      }
      // Clean up geocoder
      if (geocoder && geocoderContainer.current) {
        try {
          geocoderContainer.current.innerHTML = ''
        } catch (error) {
          console.error('Error cleaning up geocoder:', error)
        }
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

  // Function to abbreviate address text
  const abbreviateAddress = (address: string) => {
    // Common street type abbreviations
    const abbreviations: Record<string, string> = {
      'Street': 'St',
      'Avenue': 'Ave',
      'Boulevard': 'Blvd',
      'Drive': 'Dr',
      'Road': 'Rd',
      'Lane': 'Ln',
      'Court': 'Ct',
      'Circle': 'Cir',
      'Place': 'Pl',
      'Highway': 'Hwy',
      'Crescent': 'Cres',
      'Parkway': 'Pkwy',
      'Square': 'Sq',
      'Terrace': 'Terr',
      'Trail': 'Trl',
      'Way': 'Wy',
      'Ontario': 'ON',
      'Canada': 'CA',
      'North': 'N',
      'South': 'S',
      'East': 'E',
      'West': 'W',
      'Northwest': 'NW',
      'Northeast': 'NE',
      'Southwest': 'SW',
      'Southeast': 'SE'
    }
    
    let result = address
    
    // Replace full words with abbreviations
    Object.entries(abbreviations).forEach(([full, abbr]) => {
      const regex = new RegExp(`\\b${full}\\b`, 'g')
      result = result.replace(regex, abbr)
    })
    
    return result
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
        if (mapLoaded && mapInstance) {
          try {
            // Remove existing marker if it exists
            if (currentMarker) {
              currentMarker.remove();
            }
            
            // Create a new marker
            const marker = new mapboxgl.Marker({
              color: '#4285F4',
              scale: 1.2
            });
            
            // Create a popup for the marker
            const popup = new mapboxgl.Popup({
              closeButton: true,
              closeOnClick: false,
              maxWidth: '300px'
            });
            
            // Add the marker to the map
            marker.setLngLat([longitude, latitude]).addTo(mapInstance);
            
            // Add popup to marker with content
            const currentDate = new Date().toLocaleString();
            popup.setHTML(`
              <div style="padding: 8px;">
                <p><strong>Created:</strong> ${currentDate}</p>
                <p><strong>Coordinates:</strong> ${latitude.toFixed(6)}, ${longitude.toFixed(6)}</p>
                <button id="street-view-btn" style="background-color: #4285F4; color: white; border: none; padding: 6px 12px; border-radius: 4px; margin-top: 8px; cursor: pointer; width: 100%;">
                  Open Google Street View
                </button>
              </div>
            `);
            marker.setPopup(popup);
            
            // Add event listener for Street View button
            marker.getElement().addEventListener('click', () => {
              setTimeout(() => {
                const streetViewBtn = document.getElementById('street-view-btn');
                if (streetViewBtn) {
                  streetViewBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setStreetViewCoords({
                      lat: marker.getLngLat().lat,
                      lng: marker.getLngLat().lng
                    });
                    setShowStreetView(true);
                    marker.togglePopup(); // Close the popup
                  });
                }
              }, 100);
            });
            
            // Store the marker for later use
            setCurrentMarker(marker);
            
            // Center the map on the location
            mapInstance.flyTo({
              center: [longitude, latitude],
              zoom: 15,
              essential: true
            })
            
            // Get the address from coordinates
            const accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? ''
            const address = await reverseGeocode(longitude, latitude, accessToken)
            const abbreviatedAddress = abbreviateAddress(address)
            
            // Update form with location data
            updateForm({
              geospatial: {
                ...formData.geospatial,
                address: address,
                abbreviatedAddress: abbreviatedAddress,
                longitude: longitude,
                latitude: latitude
              }
            })
            
            // Update the geocoder input with the abbreviated address
            if (geocoder && geocoder._inputEl) {
              geocoder._inputEl.value = abbreviatedAddress
            }
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
      {/* Custom styles to position geocoder suggestions ABOVE the input field instead of below */}
      <style jsx global>{`
        /* Position suggestions above the input field */
        .geocoder-container .mapboxgl-ctrl-geocoder .suggestions {
          top: auto;
          bottom: 100%;
          margin-bottom: 8px;
          box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
          max-height: 200px;
          overflow-y: auto;
          z-index: 10;
        }
        
        /* Ensure the geocoder container has proper positioning */
        .geocoder-container .mapboxgl-ctrl-geocoder {
          position: relative;
          width: 100% !important;
          max-width: none !important;
          box-shadow: none;
          border: none;
        }
        
        /* Ensure the suggestions container is properly positioned */
        .geocoder-container .mapboxgl-ctrl-geocoder .suggestions > .active > a,
        .geocoder-container .mapboxgl-ctrl-geocoder .suggestions > li > a {
          padding: 8px 12px;
        }

        /* Hide Mapbox attribution completely */
        .mapboxgl-ctrl-attrib {
          display: none !important;
        }

        /* Truncate address text in geocoder input */
        .mapboxgl-ctrl-geocoder--input {
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      `}</style>
      
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
          >
            {/* Street View overlay */}
            {showStreetView && streetViewCoords && (
              <div className="absolute inset-0 z-50 bg-black">
                <div className="relative w-full h-full">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/streetview?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&location=${streetViewCoords.lat},${streetViewCoords.lng}&heading=210&pitch=10&fov=90`}
                    style={{ width: '100%', height: '100%', border: 0 }}
                    allowFullScreen
                  />
                  <button
                    onClick={() => setShowStreetView(false)}
                    className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                    aria-label="Close Street View"
                  >
                    <X className="w-6 h-6 text-gray-700" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 items-start">
            <div className="space-y-2 flex-1">
              <Label className="text-black">Address:</Label>
              <div className="flex gap-2">
                {/* Geocoder container */}
                <div 
                  ref={geocoderContainer} 
                  className="flex-1 geocoder-container"
                  style={{ 
                    minHeight: '38px',
                    border: '2px solid #1e3a8a',
                    borderRadius: '0.25rem',
                    position: 'relative'
                  }}
                />
                <Button 
                  type="button" 
                  onClick={handleGeolocate} 
                  className="bg-[#1e3a8a] hover:bg-[#162c69] px-2"
                  aria-label="Get current location"
                  title="Get current location"
                >
                  <MapPin className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-2 -mt-1">
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

