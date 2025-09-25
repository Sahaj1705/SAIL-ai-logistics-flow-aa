import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard - AI Logistics Flow",
  description: "Real-time logistics operations dashboard",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
