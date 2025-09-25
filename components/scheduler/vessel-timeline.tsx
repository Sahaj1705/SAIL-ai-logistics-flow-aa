"use client"

import { format, differenceInHours } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertTriangle } from "lucide-react"

interface VesselTimelineProps {
  vessel: any
  currentTime: Date
}

export function VesselTimeline({ vessel, currentTime }: VesselTimelineProps) {
  return (
    <div className="space-y-4">
      <div className="text-sm font-medium">{vessel.name}</div>

      <div className="space-y-3">
        {vessel.schedule.map((task: any, index: number) => {
          const isActive = task.status === "in-progress"
          const isPast = task.status === "completed"
          const arrivalTime = new Date(task.arrivalTime)
          const departureTime = new Date(task.departureTime)
          const duration = differenceInHours(departureTime, arrivalTime)

          return (
            <div key={index} className="flex items-start gap-3">
              {/* Timeline indicator */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-3 h-3 rounded-full border-2 ${
                    isPast
                      ? "bg-green-500 border-green-500"
                      : isActive
                        ? "bg-blue-500 border-blue-500"
                        : "bg-background border-muted-foreground"
                  }`}
                />
                {index < vessel.schedule.length - 1 && <div className="w-0.5 h-8 bg-muted-foreground/30 mt-1" />}
              </div>

              {/* Task details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{task.portName}</span>
                  <Badge variant={isPast ? "default" : isActive ? "secondary" : "outline"}>{task.status}</Badge>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {format(arrivalTime, "MMM dd, HH:mm")} - {format(departureTime, "HH:mm")}
                    </span>
                    <span>({duration}h)</span>
                  </div>

                  {task.constraints.length > 0 && (
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-yellow-500" />
                      <span className="text-yellow-600">{task.constraints[0]}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="pt-3 border-t text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>Total Duration:</span>
          <span>{vessel.totalDuration}h</span>
        </div>
        <div className="flex justify-between">
          <span>Delays:</span>
          <span className={vessel.delays > 0 ? "text-red-500" : "text-green-500"}>{vessel.delays}h</span>
        </div>
      </div>
    </div>
  )
}
