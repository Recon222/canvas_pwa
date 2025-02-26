"use client"

import type React from "react"

import { useForm } from "../contexts/form-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Save } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ProgressBar } from "@/components/ui/progress-bar"

export function OccurrenceForm() {
  const { formData, updateForm } = useForm()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/create-canvass/attempts")
  }

  return (
    <div className="min-h-[667px] bg-white">
      <div className="m-4 bg-[#1e3a8a] rounded-lg">
        <div className="flex items-center p-4">
          <div className="w-10 h-10 relative">
            <Image src="/placeholder.svg" alt="Police Logo" fill className="object-contain" priority />
          </div>
          <h1 className="flex-1 text-xl font-semibold text-white text-center">Select Occurrence</h1>
          <Save className="w-6 h-6 text-white" />
        </div>
        <ProgressBar progress={12.5} />
      </div>

      <div className="px-4 py-6">
        {/* Remove the h1 from here since it's now in the banner */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <Select value={formData.occurrence} onValueChange={(value) => updateForm({ occurrence: value })}>
              <SelectTrigger className="w-full border-2 border-[#1e3a8a] bg-white rounded">
                <SelectValue placeholder="1" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
              </SelectContent>
            </Select>

            <div className="space-y-2">
              <Label className="text-black">Date (YYYY-MM-DD):</Label>
              <Input
                type="date"
                placeholder="Type here"
                value={formData.date}
                onChange={(e) => updateForm({ date: e.target.value })}
                className="w-full border-2 border-[#1e3a8a] bg-white rounded"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-black">Time (h:mm):</Label>
              <div className="space-y-3">
                <Input
                  type="time"
                  placeholder="Type here"
                  value={formData.time}
                  onChange={(e) => updateForm({ time: e.target.value })}
                  className="w-full border-2 border-[#1e3a8a] bg-white rounded"
                />
                <RadioGroup
                  value={formData.timeFormat}
                  onValueChange={(value: "AM" | "PM") => updateForm({ timeFormat: value })}
                  className="flex gap-8"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="AM" id="am" className="w-6 h-6 border-2 border-[#1e3a8a]" />
                    <Label htmlFor="am" className="text-black">
                      AM
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="PM" id="pm" className="w-6 h-6 border-2 border-[#1e3a8a]" />
                    <Label htmlFor="pm" className="text-black">
                      PM
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-black">Badge #</Label>
              <Input
                type="text"
                placeholder="Type here"
                value={formData.badge}
                onChange={(e) => updateForm({ badge: e.target.value })}
                className="w-full border-2 border-[#1e3a8a] bg-white rounded"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Link href="/">
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

