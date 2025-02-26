import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Script from "next/script"
import { Toaster } from "@/components/ui/toaster"
import dynamic from "next/dynamic"

const InstallPWA = dynamic(() => import("@/app/components/InstallPWA"), {
  ssr: false,
})

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Police Canvass Mobilization App",
  description: "Mobile application for police canvassing activities",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Canvass App",
  },
  generator: 'v0.dev'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Canvass App" />
        <link rel="apple-touch-icon" href="/police-logo-192.png" />
      </head>
      <body className={`${inter.className} min-h-full`}>
        {children}
        <InstallPWA />
        <Toaster />
        <Script src="/sw-register.js" strategy="beforeInteractive" />
      </body>
    </html>
  )
}