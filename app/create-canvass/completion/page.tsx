"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Completion() {
  const [isCompleted, setIsCompleted] = useState(false)
  const router = useRouter()

  const handleCompletion = () => {
    setIsCompleted(true)
  }

  const handleAppend = () => {
    router.push("/")
  }

  return (
    <div className="min-h-[667px] h-screen bg-[#1e3a8a] flex flex-col items-center justify-between p-8 sm:p-12">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full gap-8 sm:gap-12 -mt-16">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center leading-tight">
          HOMICIDE AND
          <br />
          MISSING PERSONS
          <br />
          BUREAU
        </h1>

        <div className="w-32 h-32 sm:w-40 sm:h-40 relative">
          <Image src="/placeholder.svg" alt="Police Logo" fill className="object-contain" priority />
        </div>

        <div className="flex flex-col items-center gap-8">
          <p className="text-lg sm:text-xl text-white text-center font-medium">Occurrence information has been saved</p>

          <div
            className={cn(
              "transition-all duration-500 ease-in-out transform",
              isCompleted ? "opacity-100 scale-100" : "opacity-0 scale-0",
            )}
          >
            <CheckCircle2 className="w-16 h-16 text-white" />
          </div>
        </div>
      </div>

      <div className="w-full max-w-[280px] sm:max-w-[320px]">
        <Button
          onClick={isCompleted ? handleAppend : handleCompletion}
          className="w-full h-12 sm:h-14 bg-gray-900 text-white hover:bg-gray-800 rounded-md text-base sm:text-lg"
        >
          {isCompleted ? "Append Canvas" : "Canvass Completed"}
        </Button>
      </div>
    </div>
  )
}

