"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Save, RotateCcw, TrendingUp, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"

interface PredictionOverrideProps {
  prediction: any
  onOverride: (override: any) => void
}

export function PredictionOverride({ prediction, onOverride }: PredictionOverrideProps) {
  const [overrideValue, setOverrideValue] = useState([prediction.predictedDelay.pointEstimate])
  const [reason, setReason] = useState("")
  const [feedback, setFeedback] = useState("")
  const [confidence, setConfidence] = useState([prediction.confidence * 100])

  const handleSaveOverride = () => {
    const override = {
      value: overrideValue[0],
      reason,
      feedback,
      confidence: confidence[0] / 100,
      timestamp: new Date().toISOString(),
    }

    onOverride(override)

    // Reset form
    setReason("")
    setFeedback("")
  }

  const handleResetOverride = () => {
    setOverrideValue([prediction.predictedDelay.pointEstimate])
    setReason("")
    setFeedback("")
    setConfidence([prediction.confidence * 100])
  }

  const getDifference = () => {
    return overrideValue[0] - prediction.predictedDelay.pointEstimate
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Override Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Override Prediction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current vs Override */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{prediction.predictedDelay.pointEstimate}h</div>
              <div className="text-sm text-muted-foreground">AI Prediction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{overrideValue[0]}h</div>
              <div className="text-sm text-muted-foreground">Your Override</div>
            </div>
          </div>

          {/* Difference Indicator */}
          {getDifference() !== 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <Badge variant={getDifference() > 0 ? "destructive" : "default"} className="text-sm">
                {getDifference() > 0 ? "+" : ""}
                {getDifference()}h difference
              </Badge>
            </motion.div>
          )}

          {/* Override Value Slider */}
          <div className="space-y-2">
            <Label>Override Delay (hours)</Label>
            <Slider
              value={overrideValue}
              onValueChange={setOverrideValue}
              max={72}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0h</span>
              <span>{overrideValue[0]}h</span>
              <span>72h</span>
            </div>
          </div>

          {/* Confidence Adjustment */}
          <div className="space-y-2">
            <Label>Your Confidence Level (%)</Label>
            <Slider value={confidence} onValueChange={setConfidence} max={100} min={0} step={5} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>{confidence[0]}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Override</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why you're overriding the AI prediction..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleSaveOverride} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Override
            </Button>
            <Button variant="outline" onClick={handleResetOverride}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feedback & Learning */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Model Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Feedback Form */}
          <div className="space-y-2">
            <Label htmlFor="feedback">Additional Feedback</Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide feedback to help improve the AI model..."
              rows={4}
            />
          </div>

          {/* Previous Overrides */}
          {prediction.userOverride && (
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Previous Override</span>
              </div>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Value:</span>
                  <span>{prediction.userOverride.value}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reason:</span>
                  <span className="text-right max-w-[200px] truncate">{prediction.userOverride.reason}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{new Date(prediction.userOverride.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Learning Impact */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <div className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">How Your Feedback Helps</div>
            <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
              <div>• Improves prediction accuracy for similar scenarios</div>
              <div>• Helps identify new delay factors</div>
              <div>• Enhances model confidence calibration</div>
              <div>• Contributes to continuous learning</div>
            </div>
          </div>

          {/* Submit Feedback */}
          <Button variant="outline" className="w-full bg-transparent">
            <MessageSquare className="h-4 w-4 mr-2" />
            Submit Feedback
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
