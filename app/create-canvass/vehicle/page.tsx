"use client"

import type React from "react"

import { useForm } from "../../contexts/form-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Save } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProgressBar } from "@/components/ui/progress-bar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function VehicleInformation() {
  const { formData, updateForm } = useForm()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/create-canvass/video-details")
  }

  const updateVehicle = (vehicleId: string, field: string, value: string) => {
    updateForm({
      vehicle: {
        vehicles: formData.vehicle.vehicles.map((v) => (v.id === vehicleId ? { ...v, [field]: value } : v)),
      },
    })
  }

  const addVehicle = () => {
    const newId = (formData.vehicle.vehicles.length + 1).toString()
    updateForm({
      vehicle: {
        vehicles: [
          ...formData.vehicle.vehicles,
          {
            id: newId,
            licence: "",
            make: "",
            model: "",
            colour: "",
            style: "",
            features: "",
          },
        ],
      },
    })
  }

  const removeVehicle = (vehicleId: string) => {
    updateForm({
      vehicle: {
        vehicles: formData.vehicle.vehicles.filter((v) => v.id !== vehicleId),
      },
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="m-4 bg-[#1e3a8a] rounded-lg">
        <div className="flex items-center p-4">
          <div className="w-10 h-10 relative">
            <Image src="/placeholder.svg" alt="Police Logo" fill className="object-contain" priority />
          </div>
          <h1 className="flex-1 text-xl font-semibold text-white text-center">Vehicle Information</h1>
          <Save className="w-6 h-6 text-white" />
        </div>
        <ProgressBar progress={75} />
      </div>

      <div className="px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {formData.vehicle.vehicles.map((vehicle, index) => (
              <AccordionItem key={vehicle.id} value={vehicle.id} className="border-2 border-[#1e3a8a] rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">Vehicle {index + 1}</span>
                    {vehicle.make && vehicle.model && (
                      <span className="text-sm text-muted-foreground">
                        ({vehicle.make} {vehicle.model})
                      </span>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 py-4">
                    {[
                      { field: "licence", label: "Licence" },
                      { field: "make", label: "Make" },
                      { field: "model", label: "Model" },
                      { field: "colour", label: "Colour" },
                      { field: "style", label: "Style" },
                      { field: "features", label: "Features" },
                    ].map(({ field, label }) => (
                      <div key={field} className="space-y-2">
                        <Label className="text-black">{label}</Label>
                        <Input
                          type="text"
                          placeholder="Type here"
                          value={vehicle[field as keyof typeof vehicle] || ""}
                          onChange={(e) => updateVehicle(vehicle.id, field, e.target.value)}
                          className="w-full border-2 border-[#1e3a8a] bg-white rounded"
                        />
                      </div>
                    ))}
                    {formData.vehicle.vehicles.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        className="w-full mt-4"
                        onClick={() => removeVehicle(vehicle.id)}
                      >
                        Remove Vehicle
                      </Button>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Button
            type="button"
            variant="outline"
            className="w-full border-2 border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white"
            onClick={addVehicle}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Vehicle
          </Button>

          <div className="flex justify-between pt-4">
            <Link href="/create-canvass/occupant">
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

