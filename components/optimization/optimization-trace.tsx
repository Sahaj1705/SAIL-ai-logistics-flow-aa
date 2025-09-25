"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface OptimizationTraceProps {
  isRunning: boolean
  result: any
  objective: string
}

export function OptimizationTrace({ isRunning, result, objective }: OptimizationTraceProps) {
  const [traceData, setTraceData] = useState<any[]>([])
  const [currentIteration, setCurrentIteration] = useState(0)

  useEffect(() => {
    if (isRunning) {
      // Simulate live optimization trace
      const interval = setInterval(() => {
        setCurrentIteration((prev) => {
          const next = prev + 1
          const newPoint = {
            iteration: next,
            cost: 150000 - next * 2000 + (Math.random() * 5000 - 2500),
            time: 200 - next * 1.5 + (Math.random() * 10 - 5),
            convergence: Math.max(0, 1 - next * 0.05),
          }

          setTraceData((prevData) => [...prevData, newPoint])

          if (next >= 20) {
            clearInterval(interval)
          }

          return next
        })
      }, 200)

      return () => clearInterval(interval)
    } else if (result?.trace) {
      setTraceData(
        result.trace.map((point: any, index: number) => ({
          ...point,
          convergence: Math.max(0, 1 - index * 0.1),
        })),
      )
    }
  }, [isRunning, result])

  const getObjectiveLabel = () => {
    switch (objective) {
      case "least-cost":
        return "Cost ($)"
      case "fastest":
        return "Time (hours)"
      case "risk-averse":
        return "Risk Score"
      default:
        return "Objective Value"
    }
  }

  const getObjectiveColor = () => {
    switch (objective) {
      case "least-cost":
        return "#10b981"
      case "fastest":
        return "#3b82f6"
      case "risk-averse":
        return "#f59e0b"
      default:
        return "#8b5cf6"
    }
  }

  return (
    <div className="w-full h-full space-y-4">
      {isRunning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          Optimization in progress... Iteration {currentIteration}
        </motion.div>
      )}

      <ChartContainer
        config={{
          cost: {
            label: "Cost",
            color: getObjectiveColor(),
          },
          time: {
            label: "Time",
            color: "#ef4444",
          },
          convergence: {
            label: "Convergence",
            color: "#8b5cf6",
          },
        }}
        className="h-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={traceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="iteration" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />

            {objective === "least-cost" && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="cost"
                stroke="var(--color-cost)"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Cost ($)"
              />
            )}

            {objective === "fastest" && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="time"
                stroke="var(--color-time)"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Time (hours)"
              />
            )}

            <Line
              yAxisId="right"
              type="monotone"
              dataKey="convergence"
              stroke="var(--color-convergence)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 2 }}
              name="Convergence"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      {result && (
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-600">{result.trace?.length || 0}</div>
            <div className="text-xs text-muted-foreground">Iterations</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">
              {result.totalCost ? `$${(result.totalCost / 1000).toFixed(0)}K` : "-"}
            </div>
            <div className="text-xs text-muted-foreground">Final Cost</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600">{result.totalTime ? `${result.totalTime}h` : "-"}</div>
            <div className="text-xs text-muted-foreground">Final Time</div>
          </div>
        </div>
      )}
    </div>
  )
}
