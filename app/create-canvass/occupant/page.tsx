"use client"

import type React from "react"
import { useForm } from "../../contexts/form-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Save } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ProgressBar } from "@/components/ui/progress-bar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function OccupantContact() {
  const { formData, updateForm } = useForm()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/create-canvass/vehicle")
  }

  const updateOccupant = (occupantId: string, field: string, value: string | "male" | "female" | "other" | null) => {
    updateForm({
      occupant: {
        occupants: formData.occupant.occupants.map((o) => (o.id === occupantId ? { ...o, [field]: value } : o)),
      },
    })
  }

  const addOccupant = () => {
    const newId = (formData.occupant.occupants.length + 1).toString()
    updateForm({
      occupant: {
        occupants: [
          ...formData.occupant.occupants,
          {
            id: newId,
            gender: null,
            givenName: "",
            surname: "",
            dob: "",
            phone: "",
            alternativeContact: "",
          },
        ],
      },
    })
  }

  const removeOccupant = (occupantId: string) => {
    updateForm({
      occupant: {
        occupants: formData.occupant.occupants.filter((o) => o.id !== occupantId),
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
          <h1 className="flex-1 text-xl font-semibold text-white text-center">Occupant Contact</h1>
          <Save className="w-6 h-6 text-white" />
        </div>
        <ProgressBar progress={62.5} />
      </div>

      <div className="px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {formData.occupant.occupants.map((occupant, index) => (
              <AccordionItem
                key={occupant.id}
                value={occupant.id}
                className="border-2 border-[#1e3a8a] rounded-lg px-4"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">Occupant {index + 1}</span>
                    {occupant.givenName && occupant.surname && (
                      <span className="text-sm text-muted-foreground">
                        ({occupant.givenName} {occupant.surname})
                      </span>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6 py-4">
                    <RadioGroup
                      value={occupant.gender || ""}
                      onValueChange={(value: "male" | "female" | "other") =>
                        updateOccupant(occupant.id, "gender", value)
                      }
                      className="flex gap-8 justify-center"
                    >
                      {[
                        { value: "male", label: "Male" },
                        { value: "female", label: "Female" },
                        { value: "other", label: "Other" },
                      ].map(({ value, label }) => (
                        <div key={value} className="flex items-center gap-3">
                          <RadioGroupItem
                            value={value}
                            id={`${occupant.id}-${value}`}
                            className="w-6 h-6 border-2 border-[#1e3a8a]"
                          />
                          <Label htmlFor={`${occupant.id}-${value}`} className="text-black">
                            {label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-black">Given Name:</Label>
                        <Input
                          type="text"
                          placeholder="Type here"
                          value={occupant.givenName}
                          onChange={(e) => updateOccupant(occupant.id, "givenName", e.target.value)}
                          className="w-full border-2 border-[#1e3a8a] bg-white rounded"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-black">Surname:</Label>
                        <Input
                          type="text"
                          placeholder="Type here"
                          value={occupant.surname}
                          onChange={(e) => updateOccupant(occupant.id, "surname", e.target.value)}
                          className="w-full border-2 border-[#1e3a8a] bg-white rounded"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-black">DOB (YYYY-MM-DD):</Label>
                        <Input
                          type="date"
                          placeholder="Type here"
                          value={occupant.dob}
                          onChange={(e) => updateOccupant(occupant.id, "dob", e.target.value)}
                          className="w-full border-2 border-[#1e3a8a] bg-white rounded"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-black">Phone number(s):</Label>
                        <Input
                          type="tel"
                          placeholder="Type here"
                          value={occupant.phone}
                          onChange={(e) => updateOccupant(occupant.id, "phone", e.target.value)}
                          className="w-full border-2 border-[#1e3a8a] bg-white rounded"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-black whitespace-pre-line">
                          Alternative Contact:{"\n"}
                          (Email/Social Media):
                        </Label>
                        <Input
                          type="text"
                          placeholder="Type here"
                          value={occupant.alternativeContact}
                          onChange={(e) => updateOccupant(occupant.id, "alternativeContact", e.target.value)}
                          className="w-full border-2 border-[#1e3a8a] bg-white rounded"
                        />
                      </div>
                    </div>

                    {formData.occupant.occupants.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        className="w-full mt-4"
                        onClick={() => removeOccupant(occupant.id)}
                      >
                        Remove Occupant
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
            onClick={addOccupant}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Occupant
          </Button>

          <div className="flex justify-between pt-4">
            <Link href="/create-canvass/address">
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

