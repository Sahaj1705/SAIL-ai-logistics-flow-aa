"use client"

import { useState } from "react"
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

interface CongestionHeatmapProps {
  ports: Port[]
  showCongestion: boolean
}

export function CongestionHeatmap({ ports, showCongestion }: CongestionHeatmapProps) {
  const [selectedPort, setSelectedPort] = useState<string | null>(null)

  // Convert lat/lng to SVG coordinates
  const latLngToSVG = (lat: number, lng: number) => {
    const x = ((lng - 80) / 10) * 800
    const y = ((25 - lat) / 10) * 600
    return { x, y }
  }

  // Generate heatmap intensity based on congestion
  const getHeatmapColor = (congestion: number) => {
    if (congestion < 0.3) return "#10b981"
    if (congestion < 0.6) return "#f59e0b"
    return "#ef4444"
  }

  return (
    <div className="w-full h-full relative bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 800 600" className="absolute inset-0">
        {/* Background */}
        <rect width="800" height="600" fill="#f1f5f9" className="dark:fill-slate-800" />

        {/* Congestion heatmap zones */}
        {showCongestion &&
          ports.map((port) => {
            const { x, y } = latLngToSVG(port.position.lat, port.position.lng)
            const radius = 50 + port.congestion * 100
            const color = getHeatmapColor(port.congestion)

            return (
              <g key={`heatmap-${port.id}`}>
                <defs>
                  <radialGradient id={`heatmap-${port.id}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.6" />
                    <stop offset="50%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.1" />
                  </radialGradient>
                </defs>
                <motion.circle
                  cx={x}
                  cy={y}
                  r={radius}
                  fill={`url(#heatmap-${port.id})`}
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                />
              </g>
            )
          })}

        {/* Port markers */}
        {ports.map((port) => {
          const { x, y } = latLngToSVG(port.position.lat, port.position.lng)
          const isSelected = selectedPort === port.id

          return (
            <g key={port.id}>
              <motion.circle
                cx={x}
                cy={y}
                r={isSelected ? 15 : 10}
                fill={getHeatmapColor(port.congestion)}
                stroke="#ffffff"
                strokeWidth="3"
                className="cursor-pointer"
                onClick={() => setSelectedPort(isSelected ? null : port.id)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />

              {/* Port label */}
              <text
                x={x}
                y={y - 20}
                textAnchor="middle"
                className="text-sm font-medium fill-foreground pointer-events-none"
              >
                {port.name}
              </text>

              {/* Congestion percentage */}
              <text x={x} y={y + 5} textAnchor="middle" className="text-xs font-bold fill-white pointer-events-none">
                {Math.round(port.congestion * 100)}%
              </text>

              {/* Detailed info on selection */}
              {isSelected && (
                <motion.g
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <rect
                    x={x + 20}
                    y={y - 40}
                    width="160"
                    height="80"
                    fill="#ffffff"
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    rx="8"
                    className="drop-shadow-lg"
                  />
                  <text x={x + 30} y={y - 20} className="text-sm font-semibold fill-foreground">
                    {port.name}
                  </text>
                  <text x={x + 30} y={y - 5} className="text-xs fill-muted-foreground">
                    Congestion: {Math.round(port.congestion * 100)}%
                  </text>
                  <text x={x + 30} y={y + 8} className="text-xs fill-muted-foreground">
                    Wait Time: {port.waitTime}h
                  </text>
                  <text x={x + 30} y={y + 21} className="text-xs fill-muted-foreground">
                    Vessels: {port.vessels}
                  </text>
                  <text x={x + 30} y={y + 34} className="text-xs fill-muted-foreground">
                    Throughput: {(port.throughput / 1000).toFixed(0)}K
                  </text>
                </motion.g>
              )}
            </g>
          )
        })}
      </svg>

      {/* Congestion Scale */}
      <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3">
        <div className="text-sm font-medium mb-2">Congestion Level</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-xs">Low (0-30%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-xs">Medium (30-60%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-xs">High (60%+)</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3">
        <div className="text-xs text-muted-foreground">Click on ports to view detailed information</div>
      </div>
    </div>
  )
}
