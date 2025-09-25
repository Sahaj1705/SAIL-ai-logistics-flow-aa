"use client"

import { useState, useEffect } from "react"
import { MainNav } from "@/components/layout/main-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Ship, AlertTriangle, CheckCircle, Play, Pause, Filter, Download } from "lucide-react"
import { motion } from "framer-motion"
import { GanttChart } from "@/components/scheduler/gantt-chart"
import { VesselTimeline } from "@/components/scheduler/vessel-timeline"
import { ScheduleConstraints } from "@/components/scheduler/schedule-constraints"

interface VesselSchedule {
  id: string
  name: string
  type: string
  schedule: {
    portId: string
    portName: string
    arrivalTime: string
    departureTime: string
    status: "scheduled" | "in-progress" | "completed" | "delayed"
    constraints: string[]
  }[]
  totalDuration: number
  delays: number
}

const mockScheduleData: VesselSchedule[] = [
  {
    id: "V001",
    name: "Ocean Pioneer",
    type: "Container",
    schedule: [
      {
        portId: "origin",
        portName: "Origin Port",
        arrivalTime: "2025-01-10T00:00:00Z",
        departureTime: "2025-01-10T06:00:00Z",
        status: "completed",
        constraints: [],
      },
      {
        portId: "paradip",
        portName: "Paradip Port",
        arrivalTime: "2025-01-15T08:00:00Z",
        departureTime: "2025-01-16T14:00:00Z",
        status: "in-progress",
        constraints: ["First discharge port"],
      },
      {
        portId: "haldia",
        portName: "Haldia Port",
        arrivalTime: "2025-01-18T10:00:00Z",
        departureTime: "2025-01-19T16:00:00Z",
        status: "scheduled",
        constraints: ["Sequential discharge - Always second"],
      },
      {
        portId: "plant-a",
        portName: "Steel Plant A",
        arrivalTime: "2025-01-20T08:00:00Z",
        departureTime: "2025-01-20T18:00:00Z",
        status: "scheduled",
        constraints: [],
      },
    ],
    totalDuration: 240,
    delays: 6,
  },
  {
    id: "V002",
    name: "Baltic Express",
    type: "Bulk Carrier",
    schedule: [
      {
        portId: "origin",
        portName: "Origin Port",
        arrivalTime: "2025-01-12T00:00:00Z",
        departureTime: "2025-01-12T08:00:00Z",
        status: "completed",
        constraints: [],
      },
      {
        portId: "vizag",
        portName: "Visakhapatnam Port",
        arrivalTime: "2025-01-16T12:00:00Z",
        departureTime: "2025-01-17T20:00:00Z",
        status: "scheduled",
        constraints: ["First discharge port"],
      },
      {
        portId: "haldia",
        portName: "Haldia Port",
        arrivalTime: "2025-01-19T14:00:00Z",
        departureTime: "2025-01-20T22:00:00Z",
        status: "scheduled",
        constraints: ["Sequential discharge - Always second"],
      },
      {
        portId: "plant-b",
        portName: "Steel Plant B",
        arrivalTime: "2025-01-21T10:00:00Z",
        departureTime: "2025-01-21T20:00:00Z",
        status: "scheduled",
        constraints: [],
      },
    ],
    totalDuration: 224,
    delays: 0,
  },
]

export default function SchedulerPage() {
  const [scheduleData, setScheduleData] = useState<VesselSchedule[]>(mockScheduleData)
  const [selectedVessel, setSelectedVessel] = useState<string | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())

      // Simulate schedule updates
      if (isSimulating) {
        setScheduleData((prev) =>
          prev.map((vessel) => ({
            ...vessel,
            delays: vessel.delays + (Math.random() > 0.9 ? 1 : 0),
          })),
        )
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [isSimulating])

  const handleVesselSelect = (vesselId: string) => {
    setSelectedVessel(selectedVessel === vesselId ? null : vesselId)
  }

  const handleScheduleUpdate = (vesselId: string, updates: any) => {
    setScheduleData((prev) => prev.map((vessel) => (vessel.id === vesselId ? { ...vessel, ...updates } : vessel)))
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Vessel Scheduler</h1>
            <p className="text-muted-foreground">Interactive Gantt charts and vessel scheduling</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={() => setIsSimulating(!isSimulating)}>
              {isSimulating ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Simulation
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Simulation
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Schedule Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Ship className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{scheduleData.length}</div>
                  <div className="text-xs text-muted-foreground">Active Vessels</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {Math.round(scheduleData.reduce((sum, v) => sum + v.totalDuration, 0) / scheduleData.length)}h
                  </div>
                  <div className="text-xs text-muted-foreground">Avg Duration</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold">{scheduleData.reduce((sum, v) => sum + v.delays, 0)}</div>
                  <div className="text-xs text-muted-foreground">Total Delays</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {Math.round((scheduleData.filter((v) => v.delays === 0).length / scheduleData.length) * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground">On Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Gantt Chart */}
          <div className="xl:col-span-3">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Interactive Gantt Chart
                </CardTitle>
                <CardDescription>Drag and drop to reschedule vessels (Haldia constraint enforced)</CardDescription>
              </CardHeader>
              <CardContent className="h-[500px]">
                <GanttChart
                  scheduleData={scheduleData}
                  selectedVessel={selectedVessel}
                  onVesselSelect={handleVesselSelect}
                  onScheduleUpdate={handleScheduleUpdate}
                  currentTime={currentTime}
                  isSimulating={isSimulating}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Vessel List */}
            <Card>
              <CardHeader>
                <CardTitle>Vessel Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {scheduleData.map((vessel) => (
                  <div
                    key={vessel.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedVessel === vessel.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => handleVesselSelect(vessel.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{vessel.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {vessel.type}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>{vessel.totalDuration}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delays:</span>
                        <span className={vessel.delays > 0 ? "text-red-500" : "text-green-500"}>{vessel.delays}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Progress:</span>
                        <span>
                          {vessel.schedule.filter((s) => s.status === "completed").length}/{vessel.schedule.length}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Schedule Constraints */}
            <Card>
              <CardHeader>
                <CardTitle>Schedule Constraints</CardTitle>
              </CardHeader>
              <CardContent>
                <ScheduleConstraints />
              </CardContent>
            </Card>

            {/* Timeline View */}
            {selectedVessel && (
              <Card>
                <CardHeader>
                  <CardTitle>Vessel Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <VesselTimeline
                    vessel={scheduleData.find((v) => v.id === selectedVessel)!}
                    currentTime={currentTime}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
