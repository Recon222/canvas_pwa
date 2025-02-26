import type React from "react"
export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`w-full max-w-md mx-auto px-4 sm:px-6 ${className}`}>{children}</div>
}

