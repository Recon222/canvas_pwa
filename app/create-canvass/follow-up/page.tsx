"use client"

import type React from "react"
import { useForm } from "../../contexts/form-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Save } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { ProgressBar } from "@/components/ui/progress-bar"

export default function FollowUp() {
  const { formData, updateForm } = useForm()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/create-canvass/geospatial")
  }

  const updateFollowUp = (field: string, value: string | boolean | null) => {
    updateForm({
      followUp: {
        ...formData.followUp,
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
          <h1 className="flex-1 text-xl font-semibold text-white text-center">Follow-Up</h1>
          <Save className="w-6 h-6 text-white" />
        </div>
        <ProgressBar progress={87.5} />
      </div>

      <div className="px-4 py-6">
        {/* Remove the h1 from here since it's now in the banner */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-black">Follow-up Required?</Label>
              <RadioGroup
                value={formData.followUp.required === null ? "" : formData.followUp.required.toString()}
                onValueChange={(value) => updateFollowUp("required", value === "true")}
                className="flex gap-8 justify-start"
              >
                {[
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ].map(({ value, label }) => (
                  <div key={value} className="flex items-center gap-3">
                    <RadioGroupItem
                      value={value}
                      id={`required-${value}`}
                      className="w-6 h-6 border-2 border-[#1e3a8a]"
                    />
                    <Label htmlFor={`required-${value}`} className="text-black">
                      {label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-black">Specify/Additional Information:</Label>
              <Textarea
                placeholder="Type here"
                value={formData.followUp.additionalInfo}
                onChange={(e) => updateFollowUp("additionalInfo", e.target.value)}
                className="w-full min-h-[200px] border-2 border-[#1e3a8a] bg-white rounded resize-none"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Link href="/create-canvass/video-details">
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

