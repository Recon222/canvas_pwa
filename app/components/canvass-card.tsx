"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ChevronDown, 
  ChevronUp, 
  Car, 
  Camera, 
  AlertCircle, 
  Edit, 
  Eye, 
  CheckCircle2, 
  Clock,
  Cloud
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { CanvassEntry } from "../services/mock-data"
import { formatDate } from "../lib/utils"

interface CanvassCardProps {
  entry: CanvassEntry
}

export function CanvassCard({ entry }: CanvassCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Function to get status icon and color
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { icon: <CheckCircle2 className="h-5 w-5" />, color: 'text-green-600' }
      case 'synced':
        return { icon: <Cloud className="h-5 w-5" />, color: 'text-blue-600' }
      case 'draft':
      default:
        return { icon: <Clock className="h-5 w-5" />, color: 'text-amber-600' }
    }
  }

  const statusInfo = getStatusInfo(entry.status)

  return (
    <div className="mb-4 border-2 border-[#1e3a8a] rounded-lg overflow-hidden bg-white">
      {/* Card Header - Always visible */}
      <div className="p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">{entry.occurrence}</span>
            <div className={`flex items-center ${statusInfo.color}`}>
              {statusInfo.icon}
              <span className="ml-1 text-sm capitalize">{entry.status}</span>
            </div>
          </div>
          <button 
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#1e3a8a]" 
            style={{ width: `${entry.completionPercentage}%` }}
          ></div>
        </div>
        
        {/* Basic info row */}
        <div className="mt-3 flex flex-wrap justify-between text-sm">
          <div className="flex-1 min-w-0">
            <p className="truncate font-medium">
              {entry.address.full}
            </p>
            <p className="text-gray-600 truncate">
              {entry.occupant.primaryName || "No occupant recorded"}
            </p>
          </div>
          
          <div className="flex items-center gap-3 ml-2">
            <div className={`flex items-center ${entry.hasVehicle ? 'text-green-600' : 'text-gray-400'}`} title="Vehicle Information">
              <Car className="h-4 w-4" />
            </div>
            <div className={`flex items-center ${entry.hasVideo ? 'text-green-600' : 'text-gray-400'}`} title="Security Camera">
              <Camera className="h-4 w-4" />
            </div>
            <div className={`flex items-center ${entry.needsFollowUp ? 'text-amber-600' : 'text-gray-400'}`} title="Follow-up Required">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-200 pt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-sm text-gray-600 mb-1">Address Details</h3>
              <p className="text-sm">
                {entry.address.streetNumber} {entry.address.streetName}
                {entry.address.unitNumber && `, Unit ${entry.address.unitNumber}`}
                <br />
                {entry.address.city}
              </p>
              
              <h3 className="font-semibold text-sm text-gray-600 mt-3 mb-1">Occupant Information</h3>
              <p className="text-sm">
                Primary: {entry.occupant.primaryName || "None"}<br />
                Total Occupants: {entry.occupant.count}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-sm text-gray-600 mb-1">Status Information</h3>
              <p className="text-sm">
                Created: {formatDate(entry.createdAt)}<br />
                Last Updated: {formatDate(entry.updatedAt)}<br />
                Completion: {entry.completionPercentage}%
              </p>
              
              <h3 className="font-semibold text-sm text-gray-600 mt-3 mb-1">Additional Information</h3>
              <div className="flex gap-2 text-sm">
                <span className={entry.hasVehicle ? 'text-green-600' : 'text-gray-500'}>
                  {entry.hasVehicle ? 'Has Vehicle' : 'No Vehicle'}
                </span>
                <span className="text-gray-300">|</span>
                <span className={entry.hasVideo ? 'text-green-600' : 'text-gray-500'}>
                  {entry.hasVideo ? 'Has Video' : 'No Video'}
                </span>
                <span className="text-gray-300">|</span>
                <span className={entry.needsFollowUp ? 'text-amber-600' : 'text-gray-500'}>
                  {entry.needsFollowUp ? 'Needs Follow-up' : 'No Follow-up'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <Link href={`/create-canvass?id=${entry.id}`} className="flex-1">
              <Button 
                variant="default" 
                className="w-full bg-[#1e3a8a] hover:bg-[#162c69]"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Link href={`/view-canvass/${entry.id}`} className="flex-1">
              <Button 
                variant="outline" 
                className="w-full border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white"
              >
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
} 