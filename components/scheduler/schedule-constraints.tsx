"use client"

import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, Ship, Anchor } from "lucide-react"

export function ScheduleConstraints() {
  const constraints = [
    {
      id: "sequential-discharge",
      name: "Sequential Discharge",
      description: "Haldia Port must always be the second discharge port",
      type: "critical",
      icon: Ship,
      active: true,
    },
    {
      id: "max-wait-time",
      name: "Maximum Wait Time",
      description: "Vessels cannot wait more than 72 hours at any port",
      type: "warning",
      icon: Clock,
      active: true,
    },
    {
      id: "berth-availability",
      name: "Berth Availability",
      description: "Schedule must respect berth availability windows",
      type: "info",
      icon: Anchor,
      active: true,
    },
    {
      id: "weather-buffer",
      name: "Weather Buffer",
      description: "Minimum 12-hour buffer for weather delays",
      type: "info",
      icon: AlertTriangle,
      active: false,
    },
  ]

  const getConstraintColor = (type: string) => {
    switch (type) {
      case "critical":
        return "destructive"
      case "warning":
        return "secondary"
      case "info":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-3">
      {constraints.map((constraint) => (
        <div
          key={constraint.id}
          className={`p-3 border rounded-lg ${constraint.active ? "border-primary/20 bg-primary/5" : "border-border"}`}
        >
          <div className="flex items-start gap-3">
            <constraint.icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{constraint.name}</span>
                <Badge variant={getConstraintColor(constraint.type)}>{constraint.active ? "Active" : "Inactive"}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{constraint.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
