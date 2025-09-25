"use client"

import { useState, useEffect } from "react"
import { MainNav } from "@/components/layout/main-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, Brain, Settings, Bell, Download, Upload, RefreshCw, Zap, Target, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"
import { DelayPredictor } from "@/components/ai/delay-predictor"
import { FeatureImportance } from "@/components/ai/feature-importance"
import { PredictionOverride } from "@/components/ai/prediction-override"
import { LiveAlerts } from "@/components/operations/live-alerts"
import { OperationsConsole } from "@/components/operations/operations-console"
import { SAPConnector } from "@/components/integrations/sap-connector"
import { ExcelUploader } from "@/components/integrations/excel-uploader"

interface DelayPrediction {
  vesselId: string
  vesselName: string
  portId: string
  portName: string
  arrivalTime: string
  predictedDelay: {
    pointEstimate: number
    confidenceInterval: {
      lower: number
      upper: number
    }
  }
  featureImportance: Array<{
    feature: string
    importance: number
  }>
  confidence: number
  lastUpdated: string
  userOverride?: {
    value: number
    reason: string
    timestamp: string
  }
}

const mockPredictions: DelayPrediction[] = [
  {
    vesselId: "V001",
    vesselName: "Ocean Pioneer",
    portId: "haldia",
    portName: "Haldia Port",
    arrivalTime: "2025-01-18T10:00:00Z",
    predictedDelay: {
      pointEstimate: 18,
      confidenceInterval: { lower: 8, upper: 32 },
    },
    featureImportance: [
      { feature: "Port Congestion", importance: 0.35 },
      { feature: "Weather Conditions", importance: 0.28 },
      { feature: "Vessel Size", importance: 0.18 },
      { feature: "Historical Delays", importance: 0.12 },
      { feature: "Cargo Type", importance: 0.07 },
    ],
    confidence: 0.87,
    lastUpdated: new Date().toISOString(),
  },
  {
    vesselId: "V002",
    vesselName: "Baltic Express",
    portId: "paradip",
    portName: "Paradip Port",
    arrivalTime: "2025-01-16T12:00:00Z",
    predictedDelay: {
      pointEstimate: 6,
      confidenceInterval: { lower: 2, upper: 14 },
    },
    featureImportance: [
      { feature: "Port Congestion", importance: 0.42 },
      { feature: "Berth Availability", importance: 0.31 },
      { feature: "Weather Conditions", importance: 0.15 },
      { feature: "Vessel Size", importance: 0.08 },
      { feature: "Cargo Type", importance: 0.04 },
    ],
    confidence: 0.92,
    lastUpdated: new Date().toISOString(),
  },
]

export default function OperationsPage() {
  const [predictions, setPredictions] = useState<DelayPrediction[]>(mockPredictions)
  const [selectedVessel, setSelectedVessel] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState([30]) // seconds

  // Auto-refresh predictions
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(async () => {
      await refreshPredictions()
    }, refreshInterval[0] * 1000)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval])

  const refreshPredictions = async () => {
    setIsRefreshing(true)

    try {
      // Simulate API calls for each vessel
      const updatedPredictions = await Promise.all(
        predictions.map(async (prediction) => {
          const response = await fetch("/api/predict-delay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              vesselId: prediction.vesselId,
              portId: prediction.portId,
              arrivalTime: prediction.arrivalTime,
            }),
          })

          if (response.ok) {
            const newPrediction = await response.json()
            return {
              ...prediction,
              ...newPrediction,
              vesselName: prediction.vesselName,
              portName: prediction.portName,
            }
          }

          return prediction
        }),
      )

      setPredictions(updatedPredictions)
    } catch (error) {
      console.error("Failed to refresh predictions:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handlePredictionOverride = (vesselId: string, override: any) => {
    setPredictions((prev) => prev.map((p) => (p.vesselId === vesselId ? { ...p, userOverride: override } : p)))
  }

  const selectedPrediction = predictions.find((p) => p.vesselId === selectedVessel)

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
            <h1 className="text-3xl font-bold text-foreground">Operations Console</h1>
            <p className="text-muted-foreground">AI-powered predictions and live operations monitoring</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button size="sm" onClick={refreshPredictions} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
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
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                AI Prediction Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-refresh" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
                    <Label htmlFor="auto-refresh">Auto Refresh</Label>
                  </div>
                  {autoRefresh && (
                    <div>
                      <Label className="text-sm">Refresh Interval (seconds)</Label>
                      <Slider
                        value={refreshInterval}
                        onValueChange={setRefreshInterval}
                        max={300}
                        min={10}
                        step={10}
                        className="mt-2"
                      />
                      <div className="text-xs text-muted-foreground mt-1">{refreshInterval[0]}s</div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Prediction Confidence Threshold</Label>
                  <Select defaultValue="0.8">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.7">70%</SelectItem>
                      <SelectItem value="0.8">80%</SelectItem>
                      <SelectItem value="0.9">90%</SelectItem>
                      <SelectItem value="0.95">95%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Alert Threshold (hours)</Label>
                  <Input type="number" defaultValue="12" min="1" max="72" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Predictions and Console */}
          <div className="xl:col-span-3">
            <Tabs defaultValue="predictions" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
                <TabsTrigger value="console">Operations Console</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
                <TabsTrigger value="alerts">Live Alerts</TabsTrigger>
              </TabsList>

              <TabsContent value="predictions" className="mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Delay Predictor */}
                  <Card className="h-[500px]">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        Pre-Berthing Delay Predictor
                      </CardTitle>
                      <CardDescription>AI-powered delay predictions with confidence intervals</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                      <DelayPredictor
                        predictions={predictions}
                        selectedVessel={selectedVessel}
                        onVesselSelect={setSelectedVessel}
                        isRefreshing={isRefreshing}
                      />
                    </CardContent>
                  </Card>

                  {/* Feature Importance */}
                  <Card className="h-[500px]">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Feature Importance
                      </CardTitle>
                      <CardDescription>Top factors influencing delay predictions</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                      <FeatureImportance
                        prediction={selectedPrediction}
                        onFeatureAnalysis={(feature) => console.log("Analyzing feature:", feature)}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Prediction Override */}
                {selectedPrediction && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Prediction Override & Feedback
                      </CardTitle>
                      <CardDescription>
                        Override AI predictions and provide feedback for model improvement
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PredictionOverride
                        prediction={selectedPrediction}
                        onOverride={(override) => handlePredictionOverride(selectedPrediction.vesselId, override)}
                      />
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="console" className="mt-4">
                <Card className="h-[600px]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Live Operations Console
                    </CardTitle>
                    <CardDescription>Real-time monitoring and control center</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[500px]">
                    <OperationsConsole
                      predictions={predictions}
                      onEmergencyAction={(action) => console.log("Emergency action:", action)}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="integrations" className="mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="h-[500px]">
                    <CardHeader>
                      <CardTitle>SAP Integration</CardTitle>
                      <CardDescription>Connect to SAP systems for data synchronization</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                      <SAPConnector />
                    </CardContent>
                  </Card>

                  <Card className="h-[500px]">
                    <CardHeader>
                      <CardTitle>Excel Data Upload</CardTitle>
                      <CardDescription>Upload and process Excel files for bulk data import</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                      <ExcelUploader onFileUpload={(data) => console.log("Excel data:", data)} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="alerts" className="mt-4">
                <Card className="h-[600px]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Live Alert System
                    </CardTitle>
                    <CardDescription>Real-time alerts and notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[500px]">
                    <LiveAlerts
                      predictions={predictions}
                      onAlertAction={(alert, action) => console.log("Alert action:", alert, action)}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Prediction Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Prediction Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{predictions.length}</div>
                    <div className="text-xs text-muted-foreground">Active Predictions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round((predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length) * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Avg Confidence</div>
                  </div>
                </div>

                <div className="space-y-2">
                  {predictions.map((prediction) => (
                    <div
                      key={prediction.vesselId}
                      className={`p-2 border rounded cursor-pointer transition-colors ${
                        selectedVessel === prediction.vesselId
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedVessel(prediction.vesselId)}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{prediction.vesselName}</span>
                        <Badge
                          variant={
                            prediction.predictedDelay.pointEstimate > 24
                              ? "destructive"
                              : prediction.predictedDelay.pointEstimate > 12
                                ? "secondary"
                                : "default"
                          }
                        >
                          {prediction.predictedDelay.pointEstimate}h
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {prediction.portName} • {Math.round(prediction.confidence * 100)}% confidence
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">AI Model Status</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Data Pipeline</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs text-green-600">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">SAP Connection</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <span className="text-xs text-yellow-600">Syncing</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Alert System</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs text-green-600">Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <Zap className="h-4 w-4 mr-2" />
                  Retrain Model
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Predictions
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Model Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
