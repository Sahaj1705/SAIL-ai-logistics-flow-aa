"use client"

import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ScenarioComparisonProps {
  scenarios: any[]
  selectedScenarios: string[]
  onSelectionChange: (selected: string[]) => void
}

export function ScenarioComparison({ scenarios, selectedScenarios, onSelectionChange }: ScenarioComparisonProps) {
  const selectedScenarioData = scenarios.filter((s) => selectedScenarios.includes(s.id))

  const comparisonData = selectedScenarioData.map((scenario) => ({
    name: scenario.name.substring(0, 15) + "...",
    cost: scenario.result?.totalCost || 0,
    time: scenario.result?.totalTime || 0,
    risk: Math.random() * 100, // Mock risk score
  }))

  const radarData = [
    {
      metric: "Cost Efficiency",
      ...selectedScenarioData.reduce(
        (acc, scenario, index) => ({
          ...acc,
          [`scenario${index + 1}`]: Math.max(0, 100 - (scenario.result?.totalCost || 0) / 1000),
        }),
        {},
      ),
    },
    {
      metric: "Time Efficiency",
      ...selectedScenarioData.reduce(
        (acc, scenario, index) => ({
          ...acc,
          [`scenario${index + 1}`]: Math.max(0, 100 - (scenario.result?.totalTime || 0)),
        }),
        {},
      ),
    },
    {
      metric: "Reliability",
      ...selectedScenarioData.reduce(
        (acc, scenario, index) => ({
          ...acc,
          [`scenario${index + 1}`]: Math.random() * 100,
        }),
        {},
      ),
    },
    {
      metric: "Flexibility",
      ...selectedScenarioData.reduce(
        (acc, scenario, index) => ({
          ...acc,
          [`scenario${index + 1}`]: Math.random() * 100,
        }),
        {},
      ),
    },
  ]

  const handleScenarioToggle = (scenarioId: string) => {
    if (selectedScenarios.includes(scenarioId)) {
      onSelectionChange(selectedScenarios.filter((id) => id !== scenarioId))
    } else if (selectedScenarios.length < 3) {
      onSelectionChange([...selectedScenarios, scenarioId])
    }
  }

  return (
    <div className="w-full h-full space-y-6">
      {/* Scenario Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Select Scenarios to Compare (max 3)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
            {scenarios.map((scenario) => (
              <div key={scenario.id} className="flex items-center space-x-2">
                <Checkbox
                  id={scenario.id}
                  checked={selectedScenarios.includes(scenario.id)}
                  onCheckedChange={() => handleScenarioToggle(scenario.id)}
                  disabled={!selectedScenarios.includes(scenario.id) && selectedScenarios.length >= 3}
                />
                <Label htmlFor={scenario.id} className="text-sm truncate">
                  {scenario.name}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedScenarioData.length > 0 && (
        <>
          {/* Comparison Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cost & Time Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cost & Time Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    cost: { label: "Cost ($K)", color: "#3b82f6" },
                    time: { label: "Time (hours)", color: "#10b981" },
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="cost" fill="var(--color-cost)" name="Cost ($)" />
                      <Bar yAxisId="right" dataKey="time" fill="var(--color-time)" name="Time (h)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Performance Radar */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Performance Radar</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    {selectedScenarioData.map((_, index) => (
                      <Radar
                        key={index}
                        name={`Scenario ${index + 1}`}
                        dataKey={`scenario${index + 1}`}
                        stroke={["#3b82f6", "#10b981", "#f59e0b"][index]}
                        fill={["#3b82f6", "#10b981", "#f59e0b"][index]}
                        fillOpacity={0.1}
                      />
                    ))}
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Detailed Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Metric</th>
                      {selectedScenarioData.map((scenario, index) => (
                        <th key={scenario.id} className="text-left p-2">
                          Scenario {index + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Total Cost</td>
                      {selectedScenarioData.map((scenario) => (
                        <td key={scenario.id} className="p-2">
                          ${((scenario.result?.totalCost || 0) / 1000).toFixed(0)}K
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Total Time</td>
                      {selectedScenarioData.map((scenario) => (
                        <td key={scenario.id} className="p-2">
                          {scenario.result?.totalTime || 0}h
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Objective</td>
                      {selectedScenarioData.map((scenario) => (
                        <td key={scenario.id} className="p-2">
                          <Badge variant="outline">{scenario.objective}</Badge>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Created</td>
                      {selectedScenarioData.map((scenario) => (
                        <td key={scenario.id} className="p-2 text-muted-foreground">
                          {new Date(scenario.timestamp).toLocaleDateString()}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {selectedScenarioData.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-muted-foreground">Select scenarios above to compare their performance</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
