"use client"

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

export default function GeospatialLocation() {
  const { formData, updateForm } = useForm()
  const router = useRouter()

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
            <Image src="/placeholder.svg" alt="Police Logo" fill className="object-contain" priority />
          </div>
          <h1 className="flex-1 text-xl font-semibold text-white text-center">Geospatial Location Map</h1>
          <Save className="w-6 h-6 text-white" />
        </div>
        <ProgressBar progress={100} />
      </div>

      <div className="px-4 py-6">
        {/* Remove the h1 from here since it's now in the banner */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Placeholder for future map implementation */}
          <div className="w-full h-[400px] bg-gray-100 rounded-lg border-2 border-[#1e3a8a] flex items-center justify-center text-gray-400">
            Map will be implemented here
          </div>

          <div className="flex gap-2 items-start">
            <div className="space-y-2 flex-1">
              <Label className="text-black">Address:</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter address"
                  value={formData.geospatial.address}
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

