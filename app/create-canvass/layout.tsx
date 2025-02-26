"use client"

import type React from "react"

import { FormProvider } from "../contexts/form-context"

export default function CreateCanvassLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FormProvider>
      <div className="min-h-screen bg-gray-100">
        <div className="min-h-screen bg-white">{children}</div>
      </div>
    </FormProvider>
  )
}

