"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"

interface Port {
  id: string
  name: string
  position: { lat: number; lng: number }
  congestion: number
  waitTime: number
  throughput: number
  vessels: number
}

interface Plant {
  id: string
  name: string
  position: { lat: number; lng: number }
  capacity: number
  utilization: number
  demand: number
}

interface VesselMapProps {
  ports: Port[]
  plants: Plant[]
  showShippingLanes: boolean
  animationSpeed: number
  isPlaying: boolean
  selectedPort: string | null
}

// Mock vessel data
const vessels = [
  {
    id: "V001",
    name: "Ocean Pioneer",
    position: { lat: 21.5, lng: 87.5 },
    destination: "Haldia Port",
    status: "In Transit",
    speed: 12,
    course: 45,
  },
  {
    id: "V002",
    name: "Baltic Express",
    position: { lat: 20.2648, lng: 86.6947 },
    destination: "Paradip Port",
    status: "Berthed",
    speed: 0,
    course: 0,
  },
  {
    id: "V003",
    name: "Pacific Star",
    position: { lat: 19.8, lng: 85.2 },
    destination: "Haldia Port",
    status: "Anchored",
    speed: 0,
    course: 0,
  },
]

// Shipping lanes data
const shippingLanes = [
  {
    id: "lane1",
    path: [
      { lat: 18.0, lng: 82.0 },
      { lat: 20.0, lng: 86.0 },
      { lat: 22.0, lng: 88.0 },
    ],
    traffic: 0.8,
  },
  {
    id: "lane2",
    path: [
      { lat: 16.0, lng: 80.0 },
      { lat: 17.5, lng: 83.0 },
      { lat: 20.0, lng: 86.0 },
    ],
    traffic: 0.6,
  },
]

export function VesselMap({
  ports,
  plants,
  showShippingLanes,
  animationSpeed,
  isPlaying,
  selectedPort,
}: VesselMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [hoveredVessel, setHoveredVessel] = useState<string | null>(null)

  // Convert lat/lng to SVG coordinates
  const latLngToSVG = (lat: number, lng: number) => {
    const x = ((lng - 80) / 10) * 800 // Normalize longitude to 800px width
    const y = ((25 - lat) / 10) * 600 // Normalize latitude to 600px height (inverted)
    return { x, y }
  }

  return (
    <div ref={mapRef} className="w-full h-full relative bg-blue-50 dark:bg-slate-800 rounded-lg overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 800 600" className="absolute inset-0">
        {/* Background water */}
        <rect width="800" height="600" fill="url(#waterGradient)" />

        {/* Gradients */}
        <defs>
          <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#1e40af" stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id="congestionGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.1" />
          </radialGradient>
        </defs>

        {/* Shipping Lanes */}
        {showShippingLanes &&
          shippingLanes.map((lane) => (
            <g key={lane.id}>
              <path
                d={`M ${lane.path
                  .map((point) => {
                    const { x, y } = latLngToSVG(point.lat, point.lng)
                    return `${x},${y}`
                  })
                  .join(" L ")}`}
                stroke="#3b82f6"
                strokeWidth={lane.traffic * 4}
                strokeOpacity={0.3}
                fill="none"
                strokeDasharray="10,5"
              />
              {/* Animated traffic flow */}
              {isPlaying && (
                <motion.circle
                  r="3"
                  fill="#3b82f6"
                  initial={{ offsetDistance: "0%" }}
                  animate={{ offsetDistance: "100%" }}
                  transition={{
                    duration: 10 / animationSpeed,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <animateMotion
                    dur={`${10 / animationSpeed}s`}
                    repeatCount="indefinite"
                    path={`M ${lane.path
                      .map((point) => {
                        const { x, y } = latLngToSVG(point.lat, point.lng)
                        return `${x},${y}`
                      })
                      .join(" L ")}`}
                  />
                </motion.circle>
              )}
            </g>
          ))}

        {/* Ports */}
        {ports.map((port) => {
          const { x, y } = latLngToSVG(port.position.lat, port.position.lng)
          const isSelected = selectedPort === port.id

          return (
            <g key={port.id}>
              {/* Congestion halo */}
              {port.congestion > 0.5 && (
                <circle cx={x} cy={y} r={20 + port.congestion * 20} fill="url(#congestionGradient)" />
              )}

              {/* Port marker */}
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 12 : 8}
                fill={port.congestion > 0.7 ? "#ef4444" : port.congestion > 0.5 ? "#f59e0b" : "#10b981"}
                stroke="#ffffff"
                strokeWidth="2"
                className="cursor-pointer"
              />

              {/* Port label */}
              <text x={x} y={y - 15} textAnchor="middle" className="text-xs font-medium fill-foreground">
                {port.name}
              </text>
            </g>
          )
        })}

        {/* Plants */}
        {plants.map((plant) => {
          const { x, y } = latLngToSVG(plant.position.lat, plant.position.lng)

          return (
            <g key={plant.id}>
              <rect
                x={x - 6}
                y={y - 6}
                width="12"
                height="12"
                fill="#8b5cf6"
                stroke="#ffffff"
                strokeWidth="2"
                className="cursor-pointer"
              />
              <text x={x} y={y - 15} textAnchor="middle" className="text-xs font-medium fill-foreground">
                {plant.name}
              </text>
            </g>
          )
        })}

        {/* Vessels */}
        {vessels.map((vessel) => {
          const { x, y } = latLngToSVG(vessel.position.lat, vessel.position.lng)
          const isHovered = hoveredVessel === vessel.id

          return (
            <g key={vessel.id}>
              {/* Vessel wake */}
              {vessel.status === "In Transit" && isPlaying && (
                <motion.ellipse
                  cx={x}
                  cy={y}
                  rx="15"
                  ry="5"
                  fill="#3b82f6"
                  fillOpacity="0.2"
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  animate={{ scale: 1.2, opacity: 0 }}
                  transition={{
                    duration: 2 / animationSpeed,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeOut",
                  }}
                />
              )}

              {/* Vessel marker */}
              <motion.polygon
                points={`${x},${y - 8} ${x - 6},${y + 4} ${x + 6},${y + 4}`}
                fill={vessel.status === "In Transit" ? "#3b82f6" : vessel.status === "Berthed" ? "#10b981" : "#f59e0b"}
                stroke="#ffffff"
                strokeWidth="1"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredVessel(vessel.id)}
                onMouseLeave={() => setHoveredVessel(null)}
                animate={{
                  scale: isHovered ? 1.2 : 1,
                  rotate: vessel.course,
                }}
                transition={{ duration: 0.2 }}
              />

              {/* Vessel label */}
              {isHovered && (
                <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                  <rect
                    x={x - 40}
                    y={y + 15}
                    width="80"
                    height="30"
                    fill="#ffffff"
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    rx="4"
                  />
                  <text x={x} y={y + 28} textAnchor="middle" className="text-xs font-medium fill-foreground">
                    {vessel.name}
                  </text>
                  <text x={x} y={y + 40} textAnchor="middle" className="text-xs fill-muted-foreground">
                    {vessel.status}
                  </text>
                </motion.g>
              )}
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 space-y-2">
        <div className="text-sm font-medium">Legend</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span>Vessel (In Transit)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span>Port (Low Congestion)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span>Port (High Congestion)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-600"></div>
            <span>Plant</span>
          </div>
        </div>
      </div>
    </div>
  )
}
