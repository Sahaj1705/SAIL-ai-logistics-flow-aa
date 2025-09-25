"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Info } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface FeatureImportanceProps {
  prediction: any
  onFeatureAnalysis: (feature: string) => void
}

export function FeatureImportance({ prediction, onFeatureAnalysis }: FeatureImportanceProps) {
  if (!prediction) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Select a vessel to view feature importance
      </div>
    )
  }

  const chartData = prediction.featureImportance.map((item: any) => ({
    ...item,
    importancePercent: Math.round(item.importance * 100),
  }))

  const getImportanceColor = (importance: number) => {
    if (importance > 0.3) return "#ef4444" // High importance - red
    if (importance > 0.2) return "#f59e0b" // Medium importance - yellow
    if (importance > 0.1) return "#3b82f6" // Low-medium importance - blue
    return "#10b981" // Low importance - green
  }

  const getImportanceLabel = (importance: number) => {
    if (importance > 0.3) return "Critical"
    if (importance > 0.2) return "High"
    if (importance > 0.1) return "Medium"
    return "Low"
  }

  return (
    <div className="w-full h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{prediction.vesselName} - Feature Analysis</h3>
        <Badge variant="outline">{prediction.featureImportance.length} factors</Badge>
      </div>

      {/* Feature Importance Chart */}
      <div className="h-48">
        <ChartContainer
          config={{
            importance: { label: "Importance", color: "#3b82f6" },
          }}
          className="h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="feature" type="category" width={100} />
              <ChartTooltip content={<ChartTooltipContent />} formatter={(value: any) => [`${value}%`, "Importance"]} />
              <Bar dataKey="importancePercent" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Feature List */}
      <div className="space-y-2">
        {prediction.featureImportance.map((feature: any, index: number) => (
          <motion.div
            key={feature.feature}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{feature.feature}</span>
                <Badge
                  variant="outline"
                  style={{
                    color: getImportanceColor(feature.importance),
                    borderColor: getImportanceColor(feature.importance),
                  }}
                >
                  {getImportanceLabel(feature.importance)}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={feature.importance * 100} className="flex-1 h-2" />
                <span className="text-xs text-muted-foreground min-w-[3rem]">
                  {Math.round(feature.importance * 100)}%
                </span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onFeatureAnalysis(feature.feature)} className="ml-2">
              <Info className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Insights */}
      <div className="p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium">Key Insights</span>
        </div>
        <div className="text-sm text-muted-foreground space-y-1">
          <div>
            • <strong>{prediction.featureImportance[0].feature}</strong> is the primary delay factor (
            {Math.round(prediction.featureImportance[0].importance * 100)}%)
          </div>
          <div>
            • Top 3 factors account for{" "}
            {Math.round(
              prediction.featureImportance.slice(0, 3).reduce((sum: number, f: any) => sum + f.importance, 0) * 100,
            )}
            % of prediction
          </div>
          <div>• Model confidence: {Math.round(prediction.confidence * 100)}%</div>
        </div>
      </div>
    </div>
  )
}
