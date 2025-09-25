"use client"

import { useState, useEffect } from "react"
import { MainNav } from "@/components/layout/main-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Ship,
  Anchor,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  MapPin,
  BarChart3,
  Activity,
} from "lucide-react"
import { motion } from "framer-motion"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data
const kpiData = [
  { title: "Active Vessels", value: "24", change: "+2", trend: "up", icon: Ship },
  { title: "Port Congestion", value: "68%", change: "-5%", trend: "down", icon: Anchor },
  { title: "Avg Delay", value: "18h", change: "+3h", trend: "up", icon: Clock },
  { title: "Cost Savings", value: "$2.4M", change: "+12%", trend: "up", icon: DollarSign },
]

const vesselStatusData = [
  { name: "In Transit", value: 45, color: "#3b82f6" },
  { name: "Berthed", value: 25, color: "#10b981" },
  { name: "Anchored", value: 20, color: "#f59e0b" },
  { name: "Maintenance", value: 10, color: "#ef4444" },
]

const throughputData = [
  { month: "Jan", actual: 85000, target: 90000 },
  { month: "Feb", actual: 92000, target: 95000 },
  { month: "Mar", actual: 88000, target: 92000 },
  { month: "Apr", actual: 96000, target: 98000 },
  { month: "May", actual: 102000, target: 100000 },
  { month: "Jun", actual: 98000, target: 105000 },
]

const costTrendData = [
  { week: "W1", oceanFreight: 45000, portHandling: 12000, rail: 8000, demurrage: 3500 },
  { week: "W2", oceanFreight: 47000, portHandling: 11500, rail: 8200, demurrage: 4200 },
  { week: "W3", oceanFreight: 44000, portHandling: 12500, rail: 7800, demurrage: 3100 },
  { week: "W4", oceanFreight: 46000, portHandling: 12200, rail: 8100, demurrage: 3800 },
]

const alertsData = [
  { id: 1, type: "warning", message: "Vessel V003 experiencing 6h delay at Haldia Port", time: "2 min ago" },
  { id: 2, type: "info", message: "New optimization completed - 8% cost reduction achieved", time: "15 min ago" },
  { id: 3, type: "error", message: "Port congestion at Paradip exceeding 80%", time: "1h ago" },
  { id: 4, type: "success", message: "Vessel V001 berthed successfully ahead of schedule", time: "2h ago" },
]

export default function DashboardPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d")
  const [realTimeData, setRealTimeData] = useState(kpiData)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData((prev) =>
        prev.map((item) => ({
          ...item,
          value: item.title === "Active Vessels" ? String(Math.floor(Math.random() * 5) + 22) : item.value,
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Real-time logistics operations overview</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Export Report
            </Button>
            <Button size="sm">Refresh Data</Button>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {realTimeData.map((kpi, index) => (
            <Card key={kpi.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {kpi.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                  )}
                  <span className={kpi.trend === "up" ? "text-green-500" : "text-red-500"}>{kpi.change}</span>
                  <span className="ml-1">from last week</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="throughput" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="throughput">Throughput</TabsTrigger>
                <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
                <TabsTrigger value="vessels">Vessel Status</TabsTrigger>
              </TabsList>

              <TabsContent value="throughput">
                <Card>
                  <CardHeader>
                    <CardTitle>Port Throughput Trends</CardTitle>
                    <CardDescription>Monthly cargo throughput vs targets</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        actual: {
                          label: "Actual",
                          color: "hsl(var(--chart-1))",
                        },
                        target: {
                          label: "Target",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={throughputData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="target"
                            stackId="1"
                            stroke="var(--color-target)"
                            fill="var(--color-target)"
                            fillOpacity={0.3}
                          />
                          <Area
                            type="monotone"
                            dataKey="actual"
                            stackId="2"
                            stroke="var(--color-actual)"
                            fill="var(--color-actual)"
                            fillOpacity={0.8}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="costs">
                <Card>
                  <CardHeader>
                    <CardTitle>Cost Breakdown Trends</CardTitle>
                    <CardDescription>Weekly cost analysis by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        oceanFreight: {
                          label: "Ocean Freight",
                          color: "hsl(var(--chart-1))",
                        },
                        portHandling: {
                          label: "Port Handling",
                          color: "hsl(var(--chart-2))",
                        },
                        rail: {
                          label: "Rail Transport",
                          color: "hsl(var(--chart-3))",
                        },
                        demurrage: {
                          label: "Demurrage",
                          color: "hsl(var(--chart-4))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={costTrendData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="week" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Bar dataKey="oceanFreight" stackId="a" fill="var(--color-oceanFreight)" />
                          <Bar dataKey="portHandling" stackId="a" fill="var(--color-portHandling)" />
                          <Bar dataKey="rail" stackId="a" fill="var(--color-rail)" />
                          <Bar dataKey="demurrage" stackId="a" fill="var(--color-demurrage)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="vessels">
                <Card>
                  <CardHeader>
                    <CardTitle>Vessel Status Distribution</CardTitle>
                    <CardDescription>Current status of all vessels in fleet</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col lg:flex-row items-center gap-6">
                      <div className="w-full lg:w-1/2">
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={vesselStatusData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {vesselStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="w-full lg:w-1/2 space-y-3">
                        {vesselStatusData.map((item) => (
                          <div key={item.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                              <span className="text-sm font-medium">{item.name}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{item.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Live Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alertsData.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    {alert.type === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />}
                    {alert.type === "error" && <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />}
                    {alert.type === "success" && <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />}
                    {alert.type === "info" && <BarChart3 className="h-4 w-4 text-blue-500 mt-0.5" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Port Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Port Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Haldia Port</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Paradip Port</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Visakhapatnam</span>
                    <span>60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <MapPin className="h-4 w-4 mr-2" />
                  View Vessel Map
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Run Optimization
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule Vessels
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
