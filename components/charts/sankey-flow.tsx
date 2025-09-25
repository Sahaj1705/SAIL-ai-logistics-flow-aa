"use client"

import { useMemo } from "react"
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

interface SankeyFlowProps {
  ports: Port[]
  plants: Plant[]
}

interface FlowData {
  source: string
  target: string
  value: number
  color: string
}

export function SankeyFlow({ ports, plants }: SankeyFlowProps) {
  // Generate mock flow data
  const flowData: FlowData[] = useMemo(() => {
    const flows: FlowData[] = []
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

    ports.forEach((port, portIndex) => {
      plants.forEach((plant, plantIndex) => {
        // Calculate flow based on port throughput and plant demand
        const baseFlow = (port.throughput * plant.demand) / 1000000
        const flow = Math.max(baseFlow * (0.5 + Math.random() * 0.5), 5)

        flows.push({
          source: port.name,
          target: plant.name,
          value: flow,
          color: colors[(portIndex + plantIndex) % colors.length],
        })
      })
    })

    return flows.sort((a, b) => b.value - a.value)
  }, [ports, plants])

  // Calculate positions for Sankey diagram
  const sankeyData = useMemo(() => {
    const sourceNodes = ports.map((port, index) => ({
      id: port.name,
      x: 50,
      y: 100 + index * 120,
      width: 120,
      height: 80,
      value: port.throughput / 1000,
    }))

    const targetNodes = plants.map((plant, index) => ({
      id: plant.name,
      x: 400,
      y: 150 + index * 150,
      width: 120,
      height: 80,
      value: plant.demand / 1000,
    }))

    const links = flowData.map((flow) => {
      const source = sourceNodes.find((n) => n.id === flow.source)!
      const target = targetNodes.find((n) => n.id === flow.target)!

      return {
        ...flow,
        sourceX: source.x + source.width,
        sourceY: source.y + source.height / 2,
        targetX: target.x,
        targetY: target.y + target.height / 2,
        thickness: Math.max(flow.value * 2, 3),
      }
    })

    return { sourceNodes, targetNodes, links }
  }, [ports, plants, flowData])

  return (
    <div className="w-full h-full relative bg-background rounded-lg overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 600 500" className="absolute inset-0">
        {/* Background */}
        <rect width="600" height="500" fill="transparent" />

        {/* Flow links */}
        {sankeyData.links.map((link, index) => {
          const pathData = `
            M ${link.sourceX} ${link.sourceY}
            C ${link.sourceX + 100} ${link.sourceY}
              ${link.targetX - 100} ${link.targetY}
              ${link.targetX} ${link.targetY}
          `

          return (
            <g key={`${link.source}-${link.target}`}>
              <defs>
                <linearGradient id={`flow-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={link.color} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={link.color} stopOpacity="0.4" />
                </linearGradient>
              </defs>

              <motion.path
                d={pathData}
                stroke={`url(#flow-${index})`}
                strokeWidth={link.thickness}
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, delay: index * 0.2 }}
              />

              {/* Animated flow particles */}
              <motion.circle
                r="3"
                fill={link.color}
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%" }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                  delay: index * 0.5,
                }}
              >
                <animateMotion dur="4s" repeatCount="indefinite" path={pathData} />
              </motion.circle>

              {/* Flow value label */}
              <text
                x={(link.sourceX + link.targetX) / 2}
                y={(link.sourceY + link.targetY) / 2 - 10}
                textAnchor="middle"
                className="text-xs font-medium fill-foreground"
              >
                {link.value.toFixed(1)}K
              </text>
            </g>
          )
        })}

        {/* Source nodes (Ports) */}
        {sankeyData.sourceNodes.map((node, index) => (
          <g key={`source-${node.id}`}>
            <motion.rect
              x={node.x}
              y={node.y}
              width={node.width}
              height={node.height}
              fill="#3b82f6"
              rx="8"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            />
            <text
              x={node.x + node.width / 2}
              y={node.y + node.height / 2 - 5}
              textAnchor="middle"
              className="text-sm font-semibold fill-white"
            >
              {node.id}
            </text>
            <text
              x={node.x + node.width / 2}
              y={node.y + node.height / 2 + 10}
              textAnchor="middle"
              className="text-xs fill-white opacity-80"
            >
              {node.value.toFixed(0)}K tons
            </text>
          </g>
        ))}

        {/* Target nodes (Plants) */}
        {sankeyData.targetNodes.map((node, index) => (
          <g key={`target-${node.id}`}>
            <motion.rect
              x={node.x}
              y={node.y}
              width={node.width}
              height={node.height}
              fill="#8b5cf6"
              rx="8"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            />
            <text
              x={node.x + node.width / 2}
              y={node.y + node.height / 2 - 5}
              textAnchor="middle"
              className="text-sm font-semibold fill-white"
            >
              {node.id}
            </text>
            <text
              x={node.x + node.width / 2}
              y={node.y + node.height / 2 + 10}
              textAnchor="middle"
              className="text-xs fill-white opacity-80"
            >
              {node.value.toFixed(0)}K tons
            </text>
          </g>
        ))}

        {/* Labels */}
        <text x="110" y="40" textAnchor="middle" className="text-lg font-bold fill-foreground">
          Ports
        </text>
        <text x="460" y="40" textAnchor="middle" className="text-lg font-bold fill-foreground">
          Plants
        </text>
      </svg>

      {/* Flow summary */}
      <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3">
        <div className="text-sm font-medium mb-2">Flow Summary</div>
        <div className="space-y-1 text-xs">
          <div>Total Flow: {flowData.reduce((sum, flow) => sum + flow.value, 0).toFixed(1)}K tons</div>
          <div>Active Routes: {flowData.length}</div>
          <div>
            Avg Flow Rate: {(flowData.reduce((sum, flow) => sum + flow.value, 0) / flowData.length).toFixed(1)}K tons
          </div>
        </div>
      </div>
    </div>
  )
}
