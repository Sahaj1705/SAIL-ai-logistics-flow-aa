import { NextResponse } from "next/server"

export async function GET() {
  // Mock vessel data
  const vessels = [
    {
      id: "V001",
      name: "Ocean Pioneer",
      type: "Container",
      status: "In Transit",
      position: { lat: 22.3193, lng: 114.1694 },
      destination: "Haldia Port",
      eta: "2025-01-15T08:00:00Z",
      cargo: "Steel Coils",
      capacity: 15000,
      loaded: 12500,
    },
    {
      id: "V002",
      name: "Baltic Express",
      type: "Bulk Carrier",
      status: "Berthed",
      position: { lat: 22.2855, lng: 88.1094 },
      destination: "Paradip Port",
      eta: "2025-01-12T14:30:00Z",
      cargo: "Iron Ore",
      capacity: 25000,
      loaded: 25000,
    },
    {
      id: "V003",
      name: "Pacific Star",
      type: "Container",
      status: "Anchored",
      position: { lat: 21.8045, lng: 87.0877 },
      destination: "Haldia Port",
      eta: "2025-01-16T10:15:00Z",
      cargo: "Machinery",
      capacity: 18000,
      loaded: 16200,
    },
  ]

  return NextResponse.json({ vessels })
}
