"use client"

import type React from "react"

import { useForm } from "../../contexts/form-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Save } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ProgressBar } from "@/components/ui/progress-bar"

export default function Attempts() {
  const { formData, updateForm } = useForm()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Update to navigate to address-type page
    router.push("/create-canvass/address-type")
  }

  const updateAttempts = (key: keyof typeof formData.attempts) => {
    updateForm({
      attempts: {
        ...formData.attempts,
        [key]: !formData.attempts[key],
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
          <h1 className="flex-1 text-xl font-semibold text-white text-center">Attempts</h1>
          <Save className="w-6 h-6 text-white" />
        </div>
        <ProgressBar progress={25} />
      </div>

      <div className="px-4 py-6">
        {/* Remove the h1 from here since it's now in the banner */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {[
              { key: "first", label: "1st" },
              { key: "second", label: "2nd" },
              { key: "third", label: "3rd" },
              { key: "flyerDistributed", label: "Canvass Flyer Distributed" },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center gap-3">
                <Checkbox
                  id={key}
                  checked={formData.attempts[key as keyof typeof formData.attempts]}
                  onCheckedChange={() => updateAttempts(key as keyof typeof formData.attempts)}
                  className="w-6 h-6 border-2 border-[#1e3a8a] rounded data-[state=checked]:bg-[#1e3a8a]"
                />
                <Label htmlFor={key} className="text-black">
                  {label}
                </Label>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <Link href="/create-canvass">
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

