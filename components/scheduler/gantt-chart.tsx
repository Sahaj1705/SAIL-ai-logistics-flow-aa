"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { format, addHours, differenceInHours } from "date-fns"

interface GanttChartProps {
  scheduleData: any[]
  selectedVessel: string | null
  onVesselSelect: (vesselId: string) => void
  onScheduleUpdate: (vesselId: string, updates: any) => void
  currentTime: Date
  isSimulating: boolean
}

export function GanttChart({
  scheduleData,
  selectedVessel,
  onVesselSelect,
  onScheduleUpdate,
  currentTime,
  isSimulating,
}: GanttChartProps) {
  const [draggedItem, setDraggedItem] = useState<any>(null)
  const chartRef = useRef<HTMLDivElement>(null)

  // Chart dimensions and time range
  const chartWidth = 800
  const chartHeight = scheduleData.length * 80 + 100
  const startTime = new Date("2025-01-10T00:00:00Z")
  const endTime = new Date("2025-01-25T00:00:00Z")
  const totalHours = differenceInHours(endTime, startTime)

  // Convert time to X position
  const timeToX = (time: string | Date) => {
    const timeDate = typeof time === "string" ? new Date(time) : time
    const hoursFromStart = differenceInHours(timeDate, startTime)
    return (hoursFromStart / totalHours) * (chartWidth - 100) + 50
  }

  // Convert X position to time
  const xToTime = (x: number) => {
    const hoursFromStart = ((x - 50) / (chartWidth - 100)) * totalHours
    return addHours(startTime, hoursFromStart)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#10b981"
      case "in-progress":
        return "#3b82f6"
      case "scheduled":
        return "#f59e0b"
      case "delayed":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const handleTaskDrag = (vesselId: string, taskIndex: number, newX: number) => {
    const newTime = xToTime(newX)
    const vessel = scheduleData.find((v) => v.id === vesselId)

    if (vessel) {
      const updatedSchedule = [...vessel.schedule]
      const task = updatedSchedule[taskIndex]
      const duration = differenceInHours(new Date(task.departureTime), new Date(task.arrivalTime))

      updatedSchedule[taskIndex] = {
        ...task,
        arrivalTime: newTime.toISOString(),
        departureTime: addHours(newTime, duration).toISOString(),
      }

      // Enforce Haldia constraint - if this is Haldia, ensure it's after first port
      if (task.portName === "Haldia Port" && taskIndex > 0) {
        const previousTask = updatedSchedule[taskIndex - 1]
        const previousEnd = new Date(previousTask.departureTime)

        if (newTime < previousEnd) {
          // Adjust to be after previous task
          const adjustedTime = addHours(previousEnd, 2) // 2 hour buffer
          updatedSchedule[taskIndex] = {
            ...task,
            arrivalTime: adjustedTime.toISOString(),
            departureTime: addHours(adjustedTime, duration).toISOString(),
          }
        }
      }

      onScheduleUpdate(vesselId, { schedule: updatedSchedule })
    }
  }

  return (
    <div className="w-full h-full overflow-auto bg-background">
      <div ref={chartRef} className="relative" style={{ width: chartWidth, height: chartHeight }}>
        <svg width={chartWidth} height={chartHeight} className="absolute inset-0">
          {/* Background */}
          <rect width={chartWidth} height={chartHeight} fill="transparent" />

          {/* Time grid */}
          {Array.from({ length: Math.ceil(totalHours / 24) }, (_, i) => {
            const gridTime = addHours(startTime, i * 24)
            const x = timeToX(gridTime)

            return (
              <g key={i}>
                <line x1={x} y1={0} x2={x} y2={chartHeight} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2,2" />
                <text x={x} y={20} textAnchor="middle" className="text-xs fill-muted-foreground">
                  {format(gridTime, "MMM dd")}
                </text>
              </g>
            )
          })}

          {/* Current time indicator */}
          <line
            x1={timeToX(currentTime)}
            y1={0}
            x2={timeToX(currentTime)}
            y2={chartHeight}
            stroke="#ef4444"
            strokeWidth="2"
          />

          {/* Vessel rows */}
          {scheduleData.map((vessel, vesselIndex) => {
            const y = vesselIndex * 80 + 50
            const isSelected = selectedVessel === vessel.id

            return (
              <g key={vessel.id}>
                {/* Row background */}
                <rect
                  x={0}
                  y={y - 25}
                  width={chartWidth}
                  height={70}
                  fill={isSelected ? "#3b82f6" : "transparent"}
                  fillOpacity={isSelected ? 0.1 : 0}
                  stroke={isSelected ? "#3b82f6" : "#e5e7eb"}
                  strokeWidth="1"
                  className="cursor-pointer"
                  onClick={() => onVesselSelect(vessel.id)}
                />

                {/* Vessel label */}
                <text x={10} y={y} className="text-sm font-medium fill-foreground">
                  {vessel.name}
                </text>

                {/* Schedule tasks */}
                {vessel.schedule.map((task: any, taskIndex: number) => {
                  const startX = timeToX(task.arrivalTime)
                  const endX = timeToX(task.departureTime)
                  const width = endX - startX
                  const taskY = y - 15

                  return (
                    <g key={taskIndex}>
                      {/* Task bar */}
                      <motion.rect
                        x={startX}
                        y={taskY}
                        width={width}
                        height={30}
                        fill={getStatusColor(task.status)}
                        rx="4"
                        className="cursor-move"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onMouseDown={(e) => {
                          const startMouseX = e.clientX
                          const startTaskX = startX

                          const handleMouseMove = (e: MouseEvent) => {
                            const deltaX = e.clientX - startMouseX
                            const newX = startTaskX + deltaX
                            handleTaskDrag(vessel.id, taskIndex, newX)
                          }

                          const handleMouseUp = () => {
                            document.removeEventListener("mousemove", handleMouseMove)
                            document.removeEventListener("mouseup", handleMouseUp)
                          }

                          document.addEventListener("mousemove", handleMouseMove)
                          document.addEventListener("mouseup", handleMouseUp)
                        }}
                      />

                      {/* Task label */}
                      <text
                        x={startX + width / 2}
                        y={taskY + 20}
                        textAnchor="middle"
                        className="text-xs font-medium fill-white pointer-events-none"
                      >
                        {task.portName}
                      </text>

                      {/* Constraint indicators */}
                      {task.constraints.includes("Sequential discharge - Always second") && (
                        <circle cx={startX - 5} cy={taskY + 15} r="3" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                      )}
                    </g>
                  )
                })}
              </g>
            )
          })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border">
          <div className="text-sm font-medium mb-2">Status Legend</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Delayed</span>
            </div>
          </div>
        </div>

        {/* Constraint indicator */}
        <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border">
          <div className="text-sm font-medium mb-2">Constraints</div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Haldia Always Second</span>
          </div>
        </div>
      </div>
    </div>
  )
}
