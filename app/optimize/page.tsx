"use client"

import { useState } from "react"
import { MainNav } from "@/components/layout/main-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import {
  Play,
  Pause,
  Download,
  Upload,
  Settings,
  TrendingUp,
  DollarSign,
  CheckCircle,
  BarChart3,
  Target,
  Layers,
} from "lucide-react"
import { motion } from "framer-motion"
import { OptimizationTrace } from "@/components/optimization/optimization-trace"
import { ScenarioBuilder } from "@/components/optimization/scenario-builder"
import { CostBreakdown } from "@/components/optimization/cost-breakdown"
import { ScenarioComparison } from "@/components/optimization/scenario-comparison"

interface OptimizationResult {
  optimizationId: string
  objective: string
  totalCost: number
  totalTime: number
  routes: any[]
  trace: { iteration: number; cost: number; time: number }[]
  status: "running" | "completed" | "failed"
}

const optimizationObjectives = [
  { value: "least-cost", label: "Least Cost", description: "Minimize total logistics costs" },
  { value: "fastest", label: "Fastest Delivery", description: "Minimize total delivery time" },
  { value: "risk-averse", label: "Risk Averse", description: "Balance cost and reliability" },
  { value: "balanced", label: "Balanced", description: "Optimize cost, time, and risk" },
]

export default function OptimizePage() {
  const [selectedObjective, setSelectedObjective] = useState("least-cost")
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null)
  const [scenarios, setScenarios] = useState<any[]>([])
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([])
  const [sensitivityParams, setSensitivityParams] = useState({
    fuelCost: [100],
    portCongestion: [50],
    weatherRisk: [30],
    demurrageRate: [2000],
  })

  const runOptimization = async () => {
    setIsOptimizing(true)
    setOptimizationResult(null)

    try {
      // Simulate optimization process with live updates
      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objective: selectedObjective,
          constraints: {
            sequentialDischarge: true, // Haldia always second
            maxWaitTime: 72,
            minCapacityUtilization: 0.8,
          },
          vessels: [
            { id: "V001", capacity: 15000, currentLoad: 12500 },
            { id: "V002", capacity: 25000, currentLoad: 25000 },
            { id: "V003", capacity: 18000, currentLoad: 16200 },
          ],
          sensitivityParams,
        }),
      })

      const result = await response.json()
      setOptimizationResult({ ...result, status: "completed" })
    } catch (error) {
      console.error("Optimization failed:", error)
      setOptimizationResult({
        optimizationId: "failed",
        objective: selectedObjective,
        totalCost: 0,
        totalTime: 0,
        routes: [],
        trace: [],
        status: "failed",
      })
    } finally {
      setIsOptimizing(false)
    }
  }

  const saveScenario = () => {
    if (optimizationResult) {
      const newScenario = {
        id: `scenario_${Date.now()}`,
        name: `${optimizationResult.objective} - ${new Date().toLocaleString()}`,
        objective: optimizationResult.objective,
        result: optimizationResult,
        params: sensitivityParams,
        timestamp: new Date().toISOString(),
      }
      setScenarios([...scenarios, newScenario])
    }
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
            <h1 className="text-3xl font-bold text-foreground">Optimization Engine</h1>
            <p className="text-muted-foreground">AI-powered route and cost optimization</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={runOptimization} disabled={isOptimizing}>
              {isOptimizing ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Optimization
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Optimization Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Optimization Parameters
              </CardTitle>
              <CardDescription>Configure optimization objectives and constraints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Objective Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Optimization Objective</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {optimizationObjectives.map((objective) => (
                      <div
                        key={objective.value}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedObjective === objective.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedObjective(objective.value)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{objective.label}</div>
                            <div className="text-sm text-muted-foreground">{objective.description}</div>
                          </div>
                          {selectedObjective === objective.value && <CheckCircle className="h-5 w-5 text-primary" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sensitivity Analysis */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Sensitivity Parameters</Label>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label className="text-sm">Fuel Cost ($/ton)</Label>
                        <span className="text-sm text-muted-foreground">${sensitivityParams.fuelCost[0]}</span>
                      </div>
                      <Slider
                        value={sensitivityParams.fuelCost}
                        onValueChange={(value) => setSensitivityParams({ ...sensitivityParams, fuelCost: value })}
                        max={200}
                        min={50}
                        step={5}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label className="text-sm">Port Congestion (%)</Label>
                        <span className="text-sm text-muted-foreground">{sensitivityParams.portCongestion[0]}%</span>
                      </div>
                      <Slider
                        value={sensitivityParams.portCongestion}
                        onValueChange={(value) => setSensitivityParams({ ...sensitivityParams, portCongestion: value })}
                        max={100}
                        min={0}
                        step={5}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label className="text-sm">Weather Risk (%)</Label>
                        <span className="text-sm text-muted-foreground">{sensitivityParams.weatherRisk[0]}%</span>
                      </div>
                      <Slider
                        value={sensitivityParams.weatherRisk}
                        onValueChange={(value) => setSensitivityParams({ ...sensitivityParams, weatherRisk: value })}
                        max={100}
                        min={0}
                        step={5}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label className="text-sm">Demurrage Rate ($/day)</Label>
                        <span className="text-sm text-muted-foreground">${sensitivityParams.demurrageRate[0]}</span>
                      </div>
                      <Slider
                        value={sensitivityParams.demurrageRate}
                        onValueChange={(value) => setSensitivityParams({ ...sensitivityParams, demurrageRate: value })}
                        max={5000}
                        min={1000}
                        step={100}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Results Section */}
          <div className="xl:col-span-2">
            <Tabs defaultValue="trace" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="trace">Live Trace</TabsTrigger>
                <TabsTrigger value="breakdown">Cost Breakdown</TabsTrigger>
                <TabsTrigger value="scenarios">Scenario Builder</TabsTrigger>
                <TabsTrigger value="comparison">Compare</TabsTrigger>
              </TabsList>

              <TabsContent value="trace" className="mt-4">
                <Card className="h-[500px]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Optimization Trace
                    </CardTitle>
                    <CardDescription>Real-time optimization progress and convergence</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <OptimizationTrace
                      isRunning={isOptimizing}
                      result={optimizationResult}
                      objective={selectedObjective}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="breakdown" className="mt-4">
                <Card className="h-[500px]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Cost Breakdown Analysis
                    </CardTitle>
                    <CardDescription>Detailed cost analysis by category and route</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <CostBreakdown result={optimizationResult} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="scenarios" className="mt-4">
                <Card className="h-[500px]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="h-5 w-5" />
                      Scenario Builder
                    </CardTitle>
                    <CardDescription>Build and test different optimization scenarios</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ScenarioBuilder
                      onScenarioCreate={(scenario) => setScenarios([...scenarios, scenario])}
                      sensitivityParams={sensitivityParams}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comparison" className="mt-4">
                <Card className="h-[500px]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Scenario Comparison
                    </CardTitle>
                    <CardDescription>Side-by-side comparison of optimization scenarios</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ScenarioComparison
                      scenarios={scenarios}
                      selectedScenarios={selectedScenarios}
                      onSelectionChange={setSelectedScenarios}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Results */}
            {optimizationResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Current Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ${(optimizationResult.totalCost / 1000).toFixed(0)}K
                      </div>
                      <div className="text-xs text-muted-foreground">Total Cost</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{optimizationResult.totalTime}h</div>
                      <div className="text-xs text-muted-foreground">Total Time</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Objective:</span>
                      <Badge variant="outline">
                        {optimizationObjectives.find((o) => o.value === selectedObjective)?.label}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      <Badge variant={optimizationResult.status === "completed" ? "default" : "destructive"}>
                        {optimizationResult.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Routes:</span>
                      <span>{optimizationResult.routes.length}</span>
                    </div>
                  </div>

                  <Button
                    onClick={saveScenario}
                    className="w-full"
                    size="sm"
                    disabled={optimizationResult.status !== "completed"}
                  >
                    Save Scenario
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Constraints */}
            <Card>
              <CardHeader>
                <CardTitle>Active Constraints</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sequential Discharge</span>
                  <Badge variant="default">Haldia 2nd</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Max Wait Time</span>
                  <span className="text-sm text-muted-foreground">72h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Min Capacity</span>
                  <span className="text-sm text-muted-foreground">80%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Weather Buffer</span>
                  <span className="text-sm text-muted-foreground">12h</span>
                </div>
              </CardContent>
            </Card>

            {/* Saved Scenarios */}
            <Card>
              <CardHeader>
                <CardTitle>Saved Scenarios ({scenarios.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-60 overflow-y-auto">
                {scenarios.length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-4">No scenarios saved yet</div>
                ) : (
                  scenarios.map((scenario) => (
                    <div
                      key={scenario.id}
                      className="p-2 border rounded cursor-pointer hover:bg-accent"
                      onClick={() => {
                        if (selectedScenarios.includes(scenario.id)) {
                          setSelectedScenarios(selectedScenarios.filter((id) => id !== scenario.id))
                        } else {
                          setSelectedScenarios([...selectedScenarios, scenario.id])
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium truncate">{scenario.name}</div>
                        {selectedScenarios.includes(scenario.id) && <CheckCircle className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ${(scenario.result.totalCost / 1000).toFixed(0)}K • {scenario.result.totalTime}h
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
