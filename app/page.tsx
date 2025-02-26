import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Home() {
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

        <h2 className="text-lg sm:text-xl text-white text-center font-medium">CANVASS MOBILIZATION APP</h2>
      </div>

      <div className="w-full max-w-[280px] sm:max-w-[320px]">
        <Link href="/create-canvass" className="w-full">
          <Button
            variant="secondary"
            className="w-full h-12 sm:h-14 bg-gray-900 text-white hover:bg-gray-800 rounded-md text-base sm:text-lg"
          >
            Create a Canvass
          </Button>
        </Link>
      </div>
    </div>
  )
}

