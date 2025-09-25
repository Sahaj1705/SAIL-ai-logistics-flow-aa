"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Info, CheckCircle, XCircle, Clock, Ship, Anchor } from "lucide-react"

interface Alert {
  id: string
  type: "critical" | "warning" | "info" | "success"
  title: string
  message: string
  timestamp: string
  vesselId?: string
  portId?: string
  acknowledged: boolean
  actions?: string[]
}

interface LiveAlertsProps {
  predictions: any[]
  onAlertAction: (alert: Alert, action: string) => void
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "critical",
    title: "High Delay Risk",
    message: "Vessel MV-CARGO-001 predicted 8.5hr delay at Haldia Port",
    timestamp: new Date(Date.now() - 300000).toISOString(),
    vesselId: "MV-CARGO-001",
    portId: "HALDIA",
    acknowledged: false,
    actions: ["Reschedule", "Contact Port", "Override"],
  },
  {
    id: "2",
    type: "warning",
    title: "Port Congestion",
    message: "Paradip Port showing 85% congestion level",
    timestamp: new Date(Date.now() - 600000).toISOString(),
    portId: "PARADIP",
    acknowledged: false,
    actions: ["Reroute", "Delay Arrival"],
  },
  {
    id: "3",
    type: "info",
    title: "Weather Update",
    message: "Favorable conditions expected for next 48 hours",
    timestamp: new Date(Date.now() - 900000).toISOString(),
    acknowledged: true,
    actions: [],
  },
]

export function LiveAlerts({ predictions, onAlertAction }: LiveAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    // Generate alerts from predictions
    const predictionAlerts = predictions
      .filter((p) => p.delayHours > 4)
      .map((p) => ({
        id: `pred-${p.vesselId}`,
        type: p.delayHours > 8 ? "critical" : ("warning" as const),
        title: "Delay Prediction Alert",
        message: `${p.vesselName} predicted ${p.delayHours.toFixed(1)}hr delay`,
        timestamp: new Date().toISOString(),
        vesselId: p.vesselId,
        acknowledged: false,
        actions: ["Reschedule", "Override", "Contact"],
      }))

    setAlerts((prev) => {
      const existing = prev.filter((a) => !a.id.startsWith("pred-"))
      return [...existing, ...predictionAlerts]
    })
  }, [predictions])

  const getIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <XCircle className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "info":
        return <Info className="h-4 w-4" />
      case "success":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "critical":
        return "destructive"
      case "warning":
        return "secondary"
      case "info":
        return "outline"
      case "success":
        return "default"
      default:
        return "outline"
    }
  }

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "all") return true
    if (filter === "unacknowledged") return !alert.acknowledged
    return alert.type === filter
  })

  const handleAcknowledge = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert)))
  }

  const handleAction = (alert: Alert, action: string) => {
    onAlertAction(alert, action)
    handleAcknowledge(alert.id)
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Live Alerts
        </CardTitle>
        <div className="flex gap-2 flex-wrap">
          {["all", "unacknowledged", "critical", "warning", "info"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {filteredAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-3 border rounded-lg ${alert.acknowledged ? "opacity-60" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 flex-1">
                  <div
                    className={`mt-0.5 ${
                      alert.type === "critical"
                        ? "text-red-500"
                        : alert.type === "warning"
                          ? "text-yellow-500"
                          : alert.type === "success"
                            ? "text-green-500"
                            : "text-blue-500"
                    }`}
                  >
                    {getIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                      <Badge variant={getTypeColor(alert.type) as any} className="text-xs">
                        {alert.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                      {alert.vesselId && (
                        <span className="flex items-center gap-1">
                          <Ship className="h-3 w-3" />
                          {alert.vesselId}
                        </span>
                      )}
                      {alert.portId && (
                        <span className="flex items-center gap-1">
                          <Anchor className="h-3 w-3" />
                          {alert.portId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {!alert.acknowledged && (
                    <Button size="sm" variant="outline" onClick={() => handleAcknowledge(alert.id)} className="text-xs">
                      Ack
                    </Button>
                  )}
                </div>
              </div>
              {alert.actions && alert.actions.length > 0 && !alert.acknowledged && (
                <div className="flex gap-1 mt-2 pt-2 border-t">
                  {alert.actions.map((action) => (
                    <Button
                      key={action}
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAction(alert, action)}
                      className="text-xs h-6"
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredAlerts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No alerts matching current filter</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
