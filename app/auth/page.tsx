"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, rememberMe: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate authentication delay
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to home page after "authentication"
      router.push("/home")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#1e3a8a] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and App Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 relative mb-4">
            <Image 
              src="/police-logo.png" 
              alt="Police Logo" 
              fill 
              className="object-contain" 
              priority 
            />
          </div>
          <h1 className="text-3xl font-bold text-white text-center">
            Canvass Application
          </h1>
          <p className="text-blue-200 mt-2 text-center">
            Streamline your neighborhood canvassing operations
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="rememberMe" 
                  checked={formData.rememberMe}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="rememberMe" className="text-sm cursor-pointer">
                  Remember me for 30 days
                </Label>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#1e3a8a] hover:bg-[#162c69]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></div>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-gray-500">
              Forgot your password? Contact your administrator
            </p>
          </CardFooter>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-blue-200 text-sm">
          <p>© 2023 Police Department. All rights reserved.</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>
      </div>
    </div>
  )
} 