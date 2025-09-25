"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Play } from "lucide-react"

interface ScenarioBuilderProps {
  onScenarioCreate: (scenario: any) => void
  sensitivityParams: any
}

export function ScenarioBuilder({ onScenarioCreate, sensitivityParams }: ScenarioBuilderProps) {
  const [scenarioName, setScenarioName] = useState("")
  const [scenarioDescription, setScenarioDescription] = useState("")
  const [cargoUnits, setCargoUnits] = useState([50])
  const [timeSteps, setTimeSteps] = useState([24])
  const [enableWeatherRisk, setEnableWeatherRisk] = useState(true)
  const [enablePortCongestion, setEnablePortCongestion] = useState(true)

  const createScenario = () => {
    const scenario = {
      id: `scenario_${Date.now()}`,
      name: scenarioName || `Scenario ${Date.now()}`,
      description: scenarioDescription,
      parameters: {
        cargoUnits: cargoUnits[0],
        timeSteps: timeSteps[0],
        enableWeatherRisk,
        enablePortCongestion,
        ...sensitivityParams,
      },
      timestamp: new Date().toISOString(),
    }

    onScenarioCreate(scenario)

    // Reset form
    setScenarioName("")
    setScenarioDescription("")
  }

  return (
    <div className="w-full h-full space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scenario Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Scenario Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="scenario-name">Scenario Name</Label>
              <Input
                id="scenario-name"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                placeholder="Enter scenario name"
              />
            </div>

            <div>
              <Label htmlFor="scenario-description">Description</Label>
              <Textarea
                id="scenario-description"
                value={scenarioDescription}
                onChange={(e) => setScenarioDescription(e.target.value)}
                placeholder="Describe this scenario..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Cargo Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cargo Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Semi-Discrete Cargo Units</Label>
                <span className="text-sm text-muted-foreground">{cargoUnits[0]} units</span>
              </div>
              <Slider value={cargoUnits} onValueChange={setCargoUnits} max={200} min={10} step={10} />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Time Steps (hours)</Label>
                <span className="text-sm text-muted-foreground">{timeSteps[0]}h</span>
              </div>
              <Slider value={timeSteps} onValueChange={setTimeSteps} max={72} min={6} step={6} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Risk Factors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="weather-risk" checked={enableWeatherRisk} onCheckedChange={setEnableWeatherRisk} />
              <Label htmlFor="weather-risk">Weather Risk Assessment</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="port-congestion" checked={enablePortCongestion} onCheckedChange={setEnablePortCongestion} />
              <Label htmlFor="port-congestion">Port Congestion Impact</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={createScenario} className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          Save Scenario
        </Button>
        <Button variant="outline" className="flex-1 bg-transparent">
          <Play className="h-4 w-4 mr-2" />
          Test Run
        </Button>
      </div>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Scenario Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span>Cargo Units:</span>
              <span>{cargoUnits[0]} units</span>
            </div>
            <div className="flex justify-between">
              <span>Time Resolution:</span>
              <span>{timeSteps[0]} hours</span>
            </div>
            <div className="flex justify-between">
              <span>Weather Risk:</span>
              <span>{enableWeatherRisk ? "Enabled" : "Disabled"}</span>
            </div>
            <div className="flex justify-between">
              <span>Port Congestion:</span>
              <span>{enablePortCongestion ? "Enabled" : "Disabled"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
