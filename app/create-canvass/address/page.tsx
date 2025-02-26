"use client"

import type React from "react"

import { useForm } from "../../contexts/form-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Save } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ProgressBar } from "@/components/ui/progress-bar"

export default function AddressForm() {
  const { formData, updateForm } = useForm()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/create-canvass/occupant")
  }

  const updateAddress = (field: string, value: string) => {
    updateForm({
      address: {
        ...formData.address,
        [field]: value,
      },
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Banner with left-aligned logo and centered title */}
      <div className="m-4 bg-[#1e3a8a] rounded-lg">
        <div className="flex items-center p-4">
          <div className="w-10 h-10 relative">
            <Image src="/placeholder.svg" alt="Police Logo" fill className="object-contain" priority />
          </div>
          <h1 className="flex-1 text-xl font-semibold text-white text-center">Address Canvassed</h1>
          <Save className="w-6 h-6 text-white" />
        </div>
        <ProgressBar progress={50} />
      </div>

      <div className="px-4 py-6">
        {/* Remove the h1 from here since it's now in the banner */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-black">Street #</Label>
              <Input
                type="text"
                placeholder="Type here"
                value={formData.address.streetNumber}
                onChange={(e) => updateAddress("streetNumber", e.target.value)}
                className="w-full border-2 border-[#1e3a8a] bg-white rounded"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-black">Street Name</Label>
              <Input
                type="text"
                placeholder="Type here"
                value={formData.address.streetName}
                onChange={(e) => updateAddress("streetName", e.target.value)}
                className="w-full border-2 border-[#1e3a8a] bg-white rounded"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-black">Apt/Unit #</Label>
              <Input
                type="text"
                placeholder="Type here"
                value={formData.address.unitNumber}
                onChange={(e) => updateAddress("unitNumber", e.target.value)}
                className="w-full border-2 border-[#1e3a8a] bg-white rounded"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-black">City</Label>
              <RadioGroup
                value={formData.address.city || ""}
                onValueChange={(value: "Brampton" | "Mississauga") => updateAddress("city", value)}
                className="space-y-3"
              >
                {[
                  { value: "Brampton", label: "Brampton" },
                  { value: "Mississauga", label: "Mississauga" },
                ].map(({ value, label }) => (
                  <div key={value} className="flex items-center gap-3">
                    <RadioGroupItem value={value} id={value} className="w-6 h-6 border-2 border-[#1e3a8a]" />
                    <Label htmlFor={value} className="text-black">
                      {label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Link href="/create-canvass/address-type">
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

