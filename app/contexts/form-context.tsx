"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import { v4 as uuidv4 } from 'uuid'

interface CanvassForm {
  id: string
  occurrence: string
  date: string
  time: string
  timeFormat: "AM" | "PM"
  badge: string
  addressType: "residence" | "business" | null
  address: {
    streetNumber: string
    streetName: string
    unitNumber: string
    city: "Brampton" | "Mississauga" | null
  }
  attempts: {
    first: boolean
    second: boolean
    third: boolean
    flyerDistributed: boolean
  }
  occupant: {
    occupants: Array<{
      id: string
      gender: "male" | "female" | "other" | null
      givenName: string
      surname: string
      dob: string
      phone: string
      alternativeContact: string
    }>
  }
  video: {
    fileCount: string
    fileTypes: string
    hasProprietaryPlayer: boolean | null
  }
  vehicle: {
    vehicles: Array<{
      id: string
      licence: string
      make: string
      model: string
      colour: string
      style: string
      features: string
    }>
  }
  videoDetails: {
    hasVideo: boolean | null
    type: "Surveillance" | "Cellphone" | null
    fileFormat: string
    hasProprietaryPlayer: boolean | null
    dvrMake: string
    retentionTime: string
    userName: string
    password: string
    realTime: string
    timeOnVideo: string
    timeOffset: string
    seizedBy: string
    notes: string
  }
  followUp: {
    required: boolean | null
    additionalInfo: string
  }
  geospatial: {
    address: string
    abbreviatedAddress?: string
    latitude?: number
    longitude?: number
    markerId?: string
  }
}

type FormContextType = {
  formData: CanvassForm
  updateForm: (data: Partial<CanvassForm>) => void
} | null

const FormContext = createContext<FormContextType>(null)

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<CanvassForm>({
    id: uuidv4(),
    occurrence: "1",
    date: "",
    time: "",
    timeFormat: "AM",
    badge: "",
    addressType: null,
    address: {
      streetNumber: "",
      streetName: "",
      unitNumber: "",
      city: null,
    },
    attempts: {
      first: false,
      second: false,
      third: false,
      flyerDistributed: false,
    },
    occupant: {
      occupants: [
        {
          id: "1",
          gender: null,
          givenName: "",
          surname: "",
          dob: "",
          phone: "",
          alternativeContact: "",
        },
      ],
    },
    video: {
      fileCount: "",
      fileTypes: "",
      hasProprietaryPlayer: null,
    },
    vehicle: {
      vehicles: [],
    },
    videoDetails: {
      hasVideo: null,
      type: null,
      fileFormat: "",
      hasProprietaryPlayer: null,
      dvrMake: "",
      retentionTime: "",
      userName: "",
      password: "",
      realTime: "",
      timeOnVideo: "",
      timeOffset: "",
      seizedBy: "",
      notes: "",
    },
    followUp: {
      required: null,
      additionalInfo: "",
    },
    geospatial: {
      address: "",
    },
  })

  const updateForm = (data: Partial<CanvassForm>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  return <FormContext.Provider value={{ formData, updateForm }}>{children}</FormContext.Provider>
}

export function useForm() {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error("useForm must be used within a FormProvider")
  }
  return context
}

