"use client"

import type React from "react"

import { useForm } from "../../contexts/form-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Save } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { ProgressBar } from "@/components/ui/progress-bar"

export default function AddressType() {
  const { formData, updateForm } = useForm()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/create-canvass/address")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Banner with left-aligned logo and centered title */}
      <div className="m-4 bg-[#1e3a8a] rounded-lg">
        <div className="flex items-center p-4">
          <div className="w-10 h-10 relative">
            <Image src="/placeholder.svg" alt="Police Logo" fill className="object-contain" priority />
          </div>
          <h1 className="flex-1 text-xl font-semibold text-white text-center">Type of Address</h1>
          <Save className="w-6 h-6 text-white" />
        </div>
        <ProgressBar progress={37.5} />
      </div>

      <div className="px-4 py-6">
        {/* Remove the h1 from here since it's now in the banner */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <RadioGroup
            value={formData.addressType || ""}
            onValueChange={(value: "residence" | "business") => updateForm({ addressType: value })}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { value: "residence", label: "Residence" },
              { value: "business", label: "Business" },
            ].map(({ value, label }) => (
              <div key={value} className="relative">
                <RadioGroupItem value={value} id={value} className="peer sr-only" />
                <Label
                  htmlFor={value}
                  className={cn(
                    "flex h-24 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-[#1e3a8a] bg-white text-center text-base font-medium transition-all hover:bg-[#1e3a8a] hover:text-white",
                    "peer-data-[state=checked]:bg-[#1e3a8a] peer-data-[state=checked]:text-white",
                  )}
                >
                  {label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex justify-between pt-4">
            <Link href="/create-canvass/attempts">
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

