"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LiveAlerts } from "./live-alerts"
import { AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Pause, Play } from "lucide-react"

interface OperationsConsoleProps {
  predictions?: any[]
  onAlertAction?: (alert: any, action: string) => void
}

interface SystemStatus {
  id: string
  name: string
  status: "online" | "offline" | "warning"
  lastUpdate: string
  metrics: {
    cpu: number
    memory: number
    requests: number
  }
}

interface OperationalMetric {
  id: string
  name: string
  value: number
  unit: string
  trend: "up" | "down" | "stable"
  status: "good" | "warning" | "critical"
}

const mockSystemStatus: SystemStatus[] = [
  {
    id: "ai-predictor",
    name: "AI Delay Predictor",
    status: "online",
    lastUpdate: new Date().toISOString(),
    metrics: { cpu: 45, memory: 67, requests: 1250 },
  },
  {
    id: "optimization-engine",
    name: "Optimization Engine",
    status: "online",
    lastUpdate: new Date().toISOString(),
    metrics: { cpu: 78, memory: 82, requests: 890 },
  },
  {
    id: "vessel-tracker",
    name: "Vessel Tracker",
    status: "warning",
    lastUpdate: new Date(Date.now() - 300000).toISOString(),
    metrics: { cpu: 23, memory: 45, requests: 2100 },
  },
]

const mockMetrics: OperationalMetric[] = [
  {
    id: "active-vessels",
    name: "Active Vessels",
    value: 47,
    unit: "vessels",
    trend: "up",
    status: "good",
  },
  {
    id: "avg-delay",
    name: "Avg Delay",
    value: 3.2,
    unit: "hours",
    trend: "down",
    status: "good",
  },
  {
    id: "port-efficiency",
    name: "Port Efficiency",
    value: 87,
    unit: "%",
    trend: "stable",
    status: "good",
  },
  {
    id: "cost-savings",
    name: "Cost Savings",
    value: 2.4,
    unit: "M USD",
    trend: "up",
    status: "good",
  },
]

export function OperationsConsole({ predictions = [], onAlertAction = () => {} }: OperationsConsoleProps) {
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>(mockSystemStatus)
  const [metrics, setMetrics] = useState<OperationalMetric[]>(mockMetrics)
  const [isMonitoring, setIsMonitoring] = useState(true)

  useEffect(() => {
    if (!isMonitoring) return

    const interval = setInterval(() => {
      // Simulate real-time updates
      setSystemStatus((prev) =>
        prev.map((system) => ({
          ...system,
          lastUpdate: new Date().toISOString(),
          metrics: {
            cpu: Math.max(0, Math.min(100, system.metrics.cpu + (Math.random() - 0.5) * 10)),
            memory: Math.max(0, Math.min(100, system.metrics.memory + (Math.random() - 0.5) * 5)),
            requests: Math.max(0, system.metrics.requests + Math.floor((Math.random() - 0.5) * 100)),
          },
        })),
      )

      setMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: Math.max(0, metric.value + (Math.random() - 0.5) * (metric.value * 0.1)),
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [isMonitoring])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-500"
      case "warning":
        return "text-yellow-500"
      case "offline":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return "default"
      case "warning":
        return "secondary"
      case "offline":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-500" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-500" />
      default:
        return <div className="h-3 w-3" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Operations Console</h2>
          <p className="text-muted-foreground">Real-time system monitoring and alerts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isMonitoring ? "default" : "outline"}
            size="sm"
            onClick={() => setIsMonitoring(!isMonitoring)}
            className="flex items-center gap-2"
          >
            {isMonitoring ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isMonitoring ? "Pause" : "Resume"} Monitoring
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{metric.value.toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground">{metric.unit}</span>
                      {getTrendIcon(metric.trend)}
                    </div>
                  </div>
                  <div
                    className={`p-2 rounded-full ${
                      metric.status === "good"
                        ? "bg-green-100 text-green-600"
                        : metric.status === "warning"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                    }`}
                  >
                    {metric.status === "good" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Console */}
      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">Live Alerts</TabsTrigger>
          <TabsTrigger value="systems">System Status</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <LiveAlerts predictions={predictions} onAlertAction={onAlertAction} />
        </TabsContent>

        <TabsContent value="systems" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {systemStatus.map((system) => (
              <Card key={system.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{system.name}</CardTitle>
                    <Badge variant={getStatusBadge(system.status) as any}>{system.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-xs text-muted-foreground">
                    Last update: {new Date(system.lastUpdate).toLocaleTimeString()}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CPU</span>
                      <span>{system.metrics.cpu.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${system.metrics.cpu}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Memory</span>
                      <span>{system.metrics.memory.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-green-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${system.metrics.memory}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-sm pt-2 border-t">
                    <span>Requests/min</span>
                    <span className="font-medium">{system.metrics.requests}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: "14:32", action: "Optimization completed for Route A-B", type: "success" },
                  { time: "14:28", action: "Delay prediction updated for MV-CARGO-001", type: "info" },
                  { time: "14:25", action: "Port congestion alert triggered", type: "warning" },
                  { time: "14:20", action: "New vessel added to tracking", type: "info" },
                  { time: "14:15", action: "Schedule optimization started", type: "info" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded border">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === "success"
                          ? "bg-green-500"
                          : activity.type === "warning"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{activity.action}</span>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
