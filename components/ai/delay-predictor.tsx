"use client"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceArea } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface DelayPredictorProps {
  predictions: any[]
  selectedVessel: string | null
  onVesselSelect: (vesselId: string) => void
  isRefreshing: boolean
}

export function DelayPredictor({ predictions, selectedVessel, onVesselSelect, isRefreshing }: DelayPredictorProps) {
  const selectedPrediction = predictions.find((p) => p.vesselId === selectedVessel) || predictions[0]

  // Generate confidence interval visualization data
  const confidenceData = selectedPrediction
    ? [
        {
          time: "Current",
          lower: 0,
          estimate: 0,
          upper: 0,
        },
        {
          time: "Predicted",
          lower: selectedPrediction.predictedDelay.confidenceInterval.lower,
          estimate: selectedPrediction.predictedDelay.pointEstimate,
          upper: selectedPrediction.predictedDelay.confidenceInterval.upper,
        },
      ]
    : []

  const getDelayStatus = (delay: number) => {
    if (delay <= 6) return { color: "text-green-600", bg: "bg-green-100", label: "Low Risk" }
    if (delay <= 18) return { color: "text-yellow-600", bg: "bg-yellow-100", label: "Medium Risk" }
    return { color: "text-red-600", bg: "bg-red-100", label: "High Risk" }
  }

  return (
    <div className="w-full h-full space-y-4">
      {/* Vessel Selection */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {predictions.map((prediction) => (
          <Button
            key={prediction.vesselId}
            variant={selectedVessel === prediction.vesselId ? "default" : "outline"}
            size="sm"
            onClick={() => onVesselSelect(prediction.vesselId)}
            className="whitespace-nowrap"
          >
            {prediction.vesselName}
          </Button>
        ))}
      </div>

      {selectedPrediction && (
        <>
          {/* Prediction Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div
                className={`text-3xl font-bold ${getDelayStatus(selectedPrediction.predictedDelay.pointEstimate).color}`}
              >
                {selectedPrediction.predictedDelay.pointEstimate}h
              </div>
              <div className="text-sm text-muted-foreground">Point Estimate</div>
            </div>

            <div className="text-center">
              <div className="text-lg font-semibold">
                {selectedPrediction.predictedDelay.confidenceInterval.lower}h -{" "}
                {selectedPrediction.predictedDelay.confidenceInterval.upper}h
              </div>
              <div className="text-sm text-muted-foreground">90% Confidence Interval</div>
            </div>

            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">
                {Math.round(selectedPrediction.confidence * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Model Confidence</div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className={`${getDelayStatus(selectedPrediction.predictedDelay.pointEstimate).bg} ${getDelayStatus(selectedPrediction.predictedDelay.pointEstimate).color} border-current`}
            >
              {getDelayStatus(selectedPrediction.predictedDelay.pointEstimate).label}
            </Badge>
          </div>

          {/* Confidence Interval Chart */}
          <div className="h-48">
            <ChartContainer
              config={{
                estimate: { label: "Point Estimate", color: "#3b82f6" },
                lower: { label: "Lower Bound", color: "#10b981" },
                upper: { label: "Upper Bound", color: "#ef4444" },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={confidenceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis label={{ value: "Delay (hours)", angle: -90, position: "insideLeft" }} />
                  <ChartTooltip content={<ChartTooltipContent />} />

                  {/* Confidence interval area */}
                  <ReferenceArea
                    x1="Predicted"
                    x2="Predicted"
                    y1={selectedPrediction.predictedDelay.confidenceInterval.lower}
                    y2={selectedPrediction.predictedDelay.confidenceInterval.upper}
                    fill="#3b82f6"
                    fillOpacity={0.2}
                  />

                  <Line
                    type="monotone"
                    dataKey="estimate"
                    stroke="var(--color-estimate)"
                    strokeWidth={3}
                    dot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="lower"
                    stroke="var(--color-lower)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="upper"
                    stroke="var(--color-upper)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Vessel Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vessel:</span>
              <span className="font-medium">{selectedPrediction.vesselName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Destination:</span>
              <span className="font-medium">{selectedPrediction.portName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ETA:</span>
              <span className="font-medium">{new Date(selectedPrediction.arrivalTime).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Updated:</span>
              <span className="font-medium flex items-center gap-1">
                {new Date(selectedPrediction.lastUpdated).toLocaleTimeString()}
                {isRefreshing && <RefreshCw className="h-3 w-3 animate-spin" />}
              </span>
            </div>
          </div>

          {/* User Override Indicator */}
          {selectedPrediction.userOverride && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">User Override Active</span>
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                Override: {selectedPrediction.userOverride.value}h
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">
                Reason: {selectedPrediction.userOverride.reason}
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}
