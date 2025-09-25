"use client"

import { useState } from "react"
import { MainNav } from "@/components/layout/main-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Ship, Factory, TrendingUp, AlertTriangle, Play, Pause, RotateCcw, Layers, Filter } from "lucide-react"
import { motion } from "framer-motion"
import { VesselMap } from "@/components/maps/vessel-map"
import { SankeyFlow } from "@/components/charts/sankey-flow"
import { CongestionHeatmap } from "@/components/maps/congestion-heatmap"

const portData = [
  {
    id: "haldia",
    name: "Haldia Port",
    position: { lat: 22.0333, lng: 88.1167 },
    congestion: 0.75,
    waitTime: 48,
    throughput: 85000,
    vessels: 9,
  },
  {
    id: "paradip",
    name: "Paradip Port",
    position: { lat: 20.2648, lng: 86.6947 },
    congestion: 0.45,
    waitTime: 24,
    throughput: 95000,
    vessels: 6,
  },
  {
    id: "vizag",
    name: "Visakhapatnam Port",
    position: { lat: 17.6868, lng: 83.2185 },
    congestion: 0.6,
    waitTime: 36,
    throughput: 78000,
    vessels: 8,
  },
]

const plantData = [
  {
    id: "plant-a",
    name: "Steel Plant A",
    position: { lat: 22.5726, lng: 88.3639 },
    capacity: 50000,
    utilization: 0.85,
    demand: 42500,
  },
  {
    id: "plant-b",
    name: "Steel Plant B",
    position: { lat: 20.9517, lng: 85.0985 },
    capacity: 35000,
    utilization: 0.72,
    demand: 25200,
  },
]

export default function PortPlantPage() {
  const [selectedView, setSelectedView] = useState("overview")
  const [animationSpeed, setAnimationSpeed] = useState([1])
  const [showCongestion, setShowCongestion] = useState(true)
  const [showShippingLanes, setShowShippingLanes] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [selectedPort, setSelectedPort] = useState<string | null>("all") // Updated default value

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
            <h1 className="text-3xl font-bold text-foreground">Port & Plant Operations</h1>
            <p className="text-muted-foreground">Real-time vessel tracking and cargo flow visualization</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <Layers className="h-4 w-4 mr-2" />
              Layers
            </Button>
            <Button size="sm">Export View</Button>
          </div>
        </motion.div>

        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Visualization Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label>Animation Speed</Label>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Slider
                      value={animationSpeed}
                      onValueChange={setAnimationSpeed}
                      max={3}
                      min={0.1}
                      step={0.1}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">{animationSpeed[0]}x</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>View Options</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="congestion" checked={showCongestion} onCheckedChange={setShowCongestion} />
                      <Label htmlFor="congestion" className="text-sm">
                        Congestion Heatmap
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="shipping-lanes" checked={showShippingLanes} onCheckedChange={setShowShippingLanes} />
                      <Label htmlFor="shipping-lanes" className="text-sm">
                        Shipping Lanes
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Focus Port</Label>
                  <Select value={selectedPort || "all"} onValueChange={setSelectedPort}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select port" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ports</SelectItem>
                      {portData.map((port) => (
                        <SelectItem key={port.id} value={port.id}>
                          {port.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Quick Actions</Label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                    <Button variant="outline" size="sm">
                      Center
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Map Section */}
          <div className="xl:col-span-3">
            <Tabs value={selectedView} onValueChange={setSelectedView} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Vessel Overview</TabsTrigger>
                <TabsTrigger value="congestion">Congestion Map</TabsTrigger>
                <TabsTrigger value="flows">Cargo Flows</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4">
                <Card className="h-[600px]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Ship className="h-5 w-5" />
                      Live Vessel Tracking
                    </CardTitle>
                    <CardDescription>Real-time positions and routes of all vessels</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[500px]">
                    <VesselMap
                      ports={portData}
                      plants={plantData}
                      showShippingLanes={showShippingLanes}
                      animationSpeed={animationSpeed[0]}
                      isPlaying={isPlaying}
                      selectedPort={selectedPort}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="congestion" className="mt-4">
                <Card className="h-[600px]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Port Congestion Heatmap
                    </CardTitle>
                    <CardDescription>Real-time congestion levels and wait times</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[500px]">
                    <CongestionHeatmap ports={portData} showCongestion={showCongestion} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="flows" className="mt-4">
                <Card className="h-[600px]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Factory className="h-5 w-5" />
                      Port to Plant Flows
                    </CardTitle>
                    <CardDescription>Sankey diagram showing cargo flow distribution</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[500px]">
                    <SankeyFlow ports={portData} plants={plantData} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Port Status */}
            <Card>
              <CardHeader>
                <CardTitle>Port Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {portData.map((port) => (
                  <div key={port.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{port.name}</span>
                      <Badge
                        variant={
                          port.congestion > 0.7 ? "destructive" : port.congestion > 0.5 ? "secondary" : "default"
                        }
                      >
                        {Math.round(port.congestion * 100)}%
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex justify-between">
                        <span>Wait Time:</span>
                        <span>{port.waitTime}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vessels:</span>
                        <span>{port.vessels}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Throughput:</span>
                        <span>{(port.throughput / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Plant Utilization */}
            <Card>
              <CardHeader>
                <CardTitle>Plant Utilization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {plantData.map((plant) => (
                  <div key={plant.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{plant.name}</span>
                      <Badge variant="outline">{Math.round(plant.utilization * 100)}%</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex justify-between">
                        <span>Capacity:</span>
                        <span>{(plant.capacity / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Current:</span>
                        <span>{(plant.demand / 1000).toFixed(1)}K</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Live Updates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Live Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 p-2 rounded border">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-medium">Congestion Alert</p>
                    <p className="text-muted-foreground">Haldia Port exceeding 75%</p>
                    <p className="text-muted-foreground">2 min ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 rounded border">
                  <Ship className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-medium">Vessel Update</p>
                    <p className="text-muted-foreground">Ocean Pioneer ETA updated</p>
                    <p className="text-muted-foreground">5 min ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 rounded border">
                  <Factory className="h-4 w-4 text-green-500 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-medium">Plant Status</p>
                    <p className="text-muted-foreground">Steel Plant A at 85% capacity</p>
                    <p className="text-muted-foreground">10 min ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
