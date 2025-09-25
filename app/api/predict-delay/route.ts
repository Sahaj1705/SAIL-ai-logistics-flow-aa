import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()
  const { vesselId, portId, arrivalTime } = body

  // Simulate AI prediction
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock delay prediction
  const prediction = {
    vesselId,
    portId,
    arrivalTime,
    predictedDelay: {
      pointEstimate: 18, // hours
      confidenceInterval: {
        lower: 8,
        upper: 32,
      },
    },
    featureImportance: [
      { feature: "Port Congestion", importance: 0.35 },
      { feature: "Weather Conditions", importance: 0.28 },
      { feature: "Vessel Size", importance: 0.18 },
      { feature: "Historical Delays", importance: 0.12 },
      { feature: "Cargo Type", importance: 0.07 },
    ],
    confidence: 0.87,
    lastUpdated: new Date().toISOString(),
  }

  return NextResponse.json(prediction)
}
