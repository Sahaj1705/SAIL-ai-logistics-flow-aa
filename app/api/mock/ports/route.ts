import { NextResponse } from "next/server"

export async function GET() {
  // Mock port data
  const ports = [
    {
      id: "P001",
      name: "Haldia Port",
      position: { lat: 22.0333, lng: 88.1167 },
      congestion: 0.75,
      waitTime: 48,
      berthsTotal: 12,
      berthsOccupied: 9,
      throughput: 85000,
      capacity: 120000,
    },
    {
      id: "P002",
      name: "Paradip Port",
      position: { lat: 20.2648, lng: 86.6947 },
      congestion: 0.45,
      waitTime: 24,
      berthsTotal: 18,
      berthsOccupied: 8,
      throughput: 95000,
      capacity: 150000,
    },
    {
      id: "P003",
      name: "Visakhapatnam Port",
      position: { lat: 17.6868, lng: 83.2185 },
      congestion: 0.6,
      waitTime: 36,
      berthsTotal: 15,
      berthsOccupied: 9,
      throughput: 78000,
      capacity: 110000,
    },
  ]

  return NextResponse.json({ ports })
}
