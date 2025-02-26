"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Search, Filter, RefreshCw, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CanvassCard } from "../components/canvass-card"
import { mockDataService, type CanvassEntry } from "../services/mock-data"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  const [canvassEntries, setCanvassEntries] = useState<CanvassEntry[]>([])
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0 })
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Load canvass entries
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const entries = await mockDataService.getCanvassEntries()
        const summaryStats = await mockDataService.getSummaryStats()
        
        setCanvassEntries(entries)
        setStats(summaryStats)
      } catch (error) {
        console.error("Error loading canvass data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [])

  // Handle logout
  const handleLogout = () => {
    router.push("/")
  }

  // Filter entries based on search term
  const filteredEntries = canvassEntries.filter(entry => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      entry.occurrence.toLowerCase().includes(searchLower) ||
      entry.address.full.toLowerCase().includes(searchLower) ||
      entry.occupant.primaryName.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1e3a8a] text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 relative">
                <Image src="/police-logo.png" alt="Police Logo" fill className="object-contain" priority />
              </div>
              <h1 className="text-xl font-bold">Canvass Application</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/create-canvass">
                <Button className="bg-white text-[#1e3a8a] hover:bg-gray-100">
                  <Plus className="h-4 w-4 mr-2" />
                  New Canvass
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="text-white hover:bg-blue-800"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex gap-6">
              <div>
                <span className="text-sm text-gray-500">Total</span>
                <p className="font-semibold">{stats.total}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Completed</span>
                <p className="font-semibold text-green-600">{stats.completed}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">In Progress</span>
                <p className="font-semibold text-amber-600">{stats.inProgress}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-[#1e3a8a]"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by occurrence number, address, or occupant name..."
            className="pl-10 border-2 border-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Canvass List */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {searchTerm ? `Search Results (${filteredEntries.length})` : 'All Canvass Records'}
          </h2>
          <Button variant="outline" size="sm" className="text-gray-600">
            <Filter className="h-4 w-4 mr-1" />
            Filter
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1e3a8a] border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading canvass records...</p>
          </div>
        ) : filteredEntries.length > 0 ? (
          <div>
            {filteredEntries.map((entry) => (
              <CanvassCard key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500">
              {searchTerm 
                ? "No canvass records match your search criteria." 
                : "No canvass records found. Create your first canvass to get started."}
            </p>
            {!searchTerm && (
              <Link href="/create-canvass">
                <Button className="mt-4 bg-[#1e3a8a] hover:bg-[#162c69]">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Canvass
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 