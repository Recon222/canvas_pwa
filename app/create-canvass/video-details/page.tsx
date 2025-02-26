"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { useForm } from "../../contexts/form-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Calendar, Save } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ProgressBar } from "@/components/ui/progress-bar"

export default function VideoDetails() {
  const { formData, updateForm } = useForm()
  const router = useRouter()
  const [localTimeOffset, setLocalTimeOffset] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/create-canvass/follow-up")
  }

  const updateVideoDetails = useCallback(
    (field: string, value: string | boolean | null) => {
      updateForm({
        videoDetails: {
          ...formData.videoDetails,
          [field]: value,
        },
      })
    },
    [formData.videoDetails, updateForm],
  )

  const getCurrentDateTime = useCallback(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")
    const seconds = String(now.getSeconds()).padStart(2, "0")
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }, [])

  const calculateTimeOffset = useCallback((dvrTimeStr: string, realTimeStr: string) => {
    if (!dvrTimeStr || !realTimeStr) return ""

    try {
      const dvrTime = new Date(dvrTimeStr.replace(" ", "T"))
      const realTime = new Date(realTimeStr.replace(" ", "T"))

      const diffMs = dvrTime.getTime() - realTime.getTime()
      const hours = Math.floor(Math.abs(diffMs) / 3600000)
      const minutes = Math.floor((Math.abs(diffMs) % 3600000) / 60000)
      const seconds = Math.floor((Math.abs(diffMs) % 60000) / 1000)

      const direction = diffMs > 0 ? "AHEAD of" : "BEHIND"
      return `DVR is ${hours}hr ${minutes}min ${seconds}sec ${direction} real time`
    } catch (error) {
      return ""
    }
  }, [])

  // Update time offset when either time changes
  useEffect(() => {
    const offset = calculateTimeOffset(formData.videoDetails.timeOnVideo || "", formData.videoDetails.realTime || "")
    setLocalTimeOffset(offset)
  }, [formData.videoDetails.timeOnVideo, formData.videoDetails.realTime, calculateTimeOffset])

  const handleGetCurrentTime = useCallback(() => {
    const currentTime = getCurrentDateTime()
    const newTimeOffset = calculateTimeOffset(formData.videoDetails.timeOnVideo || "", currentTime)

    // Update both real time and time offset in a single form update
    updateForm({
      videoDetails: {
        ...formData.videoDetails,
        realTime: currentTime,
        timeOffset: newTimeOffset,
      },
    })
  }, [getCurrentDateTime, calculateTimeOffset, formData.videoDetails, updateForm])

  return (
    <div className="min-h-screen bg-white">
      {/* Rest of the JSX remains the same */}
      {/* Banner with left-aligned logo and centered title */}
      <div className="m-4 bg-[#1e3a8a] rounded-lg">
        <div className="flex items-center p-4">
          <div className="w-10 h-10 relative">
            <Image src="/placeholder.svg" alt="Police Logo" fill className="object-contain" priority />
          </div>
          <h1 className="flex-1 text-xl font-semibold text-white text-center">Video Details</h1>
          <Save className="w-6 h-6 text-white" />
        </div>
        <ProgressBar progress={87.5} />
      </div>

      <div className="px-4 py-6">
        {/* Remove the h1 from here since it's now in the banner */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-black">Do you have any Video of the incident?</Label>
              <RadioGroup
                value={formData.videoDetails.hasVideo === null ? "" : formData.videoDetails.hasVideo.toString()}
                onValueChange={(value) => updateVideoDetails("hasVideo", value === "true")}
                className="flex gap-8 justify-start"
              >
                {[
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ].map(({ value, label }) => (
                  <div key={value} className="flex items-center gap-3">
                    <RadioGroupItem
                      value={value}
                      id={`hasVideo-${value}`}
                      className="w-6 h-6 border-2 border-[#1e3a8a]"
                    />
                    <Label htmlFor={`hasVideo-${value}`} className="text-black">
                      {label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {formData.videoDetails.hasVideo && (
              <>
                <div className="space-y-2">
                  <Label className="text-black">Type of Video</Label>
                  <Select
                    value={formData.videoDetails.type || ""}
                    onValueChange={(value: "Surveillance" | "Cellphone") => updateVideoDetails("type", value)}
                  >
                    <SelectTrigger className="w-full border-2 border-[#1e3a8a] bg-white rounded">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Surveillance">Surveillance</SelectItem>
                      <SelectItem value="Cellphone">Cellphone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-black">File Format</Label>
                  <Input
                    type="text"
                    placeholder="*.Mov"
                    value={formData.videoDetails.fileFormat}
                    onChange={(e) => updateVideoDetails("fileFormat", e.target.value)}
                    className="w-full border-2 border-[#1e3a8a] bg-white rounded"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-black">Is there a Proprietary Player?</Label>
                  <RadioGroup
                    value={
                      formData.videoDetails.hasProprietaryPlayer === null
                        ? ""
                        : formData.videoDetails.hasProprietaryPlayer.toString()
                    }
                    onValueChange={(value) => updateVideoDetails("hasProprietaryPlayer", value === "true")}
                    className="flex gap-8 justify-start"
                  >
                    {[
                      { value: "true", label: "Yes" },
                      { value: "false", label: "No" },
                    ].map(({ value, label }) => (
                      <div key={value} className="flex items-center gap-3">
                        <RadioGroupItem
                          value={value}
                          id={`proprietary-${value}`}
                          className="w-6 h-6 border-2 border-[#1e3a8a]"
                        />
                        <Label htmlFor={`proprietary-${value}`} className="text-black">
                          {label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-black">Make of DVR</Label>
                  <Input
                    type="text"
                    placeholder="Type here"
                    value={formData.videoDetails.dvrMake}
                    onChange={(e) => updateVideoDetails("dvrMake", e.target.value)}
                    className="w-full border-2 border-[#1e3a8a] bg-white rounded"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-black">Retention time of DVR:</Label>
                  <Input
                    type="text"
                    placeholder="Type here"
                    value={formData.videoDetails.retentionTime}
                    onChange={(e) => updateVideoDetails("retentionTime", e.target.value)}
                    className="w-full border-2 border-[#1e3a8a] bg-white rounded"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-black">User Name</Label>
                  <Input
                    type="text"
                    placeholder="Type here"
                    value={formData.videoDetails.userName}
                    onChange={(e) => updateVideoDetails("userName", e.target.value)}
                    className="w-full border-2 border-[#1e3a8a] bg-white rounded"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-black">Password</Label>
                  <Input
                    type="password"
                    placeholder="Type here"
                    value={formData.videoDetails.password}
                    onChange={(e) => updateVideoDetails("password", e.target.value)}
                    className="w-full border-2 border-[#1e3a8a] bg-white rounded"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-black">DVR Date/Time</Label>
                  <div className="flex gap-2">
                    <Input
                      type="datetime-local"
                      step="60"
                      value={formData.videoDetails.timeOnVideo?.replace(" ", "T") || ""}
                      onChange={(e) => updateVideoDetails("timeOnVideo", e.target.value.replace("T", " "))}
                      className="w-full border-2 border-[#1e3a8a] bg-white rounded"
                    />
                    <Button type="button" variant="outline" size="icon" className="border-2 border-[#1e3a8a]">
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-black">Real Time</Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      readOnly
                      value={formData.videoDetails.realTime}
                      className="w-full border-2 border-[#1e3a8a] bg-white rounded"
                    />
                    <Button
                      type="button"
                      onClick={handleGetCurrentTime}
                      className="whitespace-nowrap bg-[#1e3a8a] hover:bg-[#162c69]"
                    >
                      Get Date/Time
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-black">Time Offset</Label>
                  <Input
                    type="text"
                    readOnly
                    value={localTimeOffset}
                    className="w-full border-2 border-[#1e3a8a] bg-white rounded"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-black">Seized by</Label>
                  <Input
                    type="text"
                    placeholder="<Officer ID>"
                    value={formData.videoDetails.seizedBy}
                    onChange={(e) => updateVideoDetails("seizedBy", e.target.value)}
                    className="w-full border-2 border-[#1e3a8a] bg-white rounded"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-black">Notes</Label>
                  <Textarea
                    placeholder="Type here"
                    value={formData.videoDetails.notes}
                    onChange={(e) => updateVideoDetails("notes", e.target.value)}
                    className="w-full border-2 border-[#1e3a8a] bg-white rounded min-h-[100px]"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <Link href="/create-canvass/vehicle">
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

