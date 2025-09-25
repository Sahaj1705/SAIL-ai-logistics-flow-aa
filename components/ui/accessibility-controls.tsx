"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Accessibility, Eye, Volume2, Keyboard } from "lucide-react"

export function AccessibilityControls() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [fontSize, setFontSize] = useState([16])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [keyboardNavigation, setKeyboardNavigation] = useState(true)

  useEffect(() => {
    // Apply reduced motion preference
    if (reducedMotion) {
      document.documentElement.style.setProperty("--motion-duration", "0s")
      document.documentElement.classList.add("reduce-motion")
    } else {
      document.documentElement.style.removeProperty("--motion-duration")
      document.documentElement.classList.remove("reduce-motion")
    }
  }, [reducedMotion])

  useEffect(() => {
    // Apply high contrast mode
    if (highContrast) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
  }, [highContrast])

  useEffect(() => {
    // Apply font size
    document.documentElement.style.setProperty("--base-font-size", `${fontSize[0]}px`)
  }, [fontSize])

  const resetToDefaults = () => {
    setReducedMotion(false)
    setHighContrast(false)
    setFontSize([16])
    setSoundEnabled(true)
    setKeyboardNavigation(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Accessibility className="h-5 w-5" />
          Accessibility Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <label className="text-sm font-medium">Reduce Motion</label>
          </div>
          <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} aria-label="Toggle reduced motion" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <label className="text-sm font-medium">High Contrast</label>
          </div>
          <Switch checked={highContrast} onCheckedChange={setHighContrast} aria-label="Toggle high contrast mode" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <label className="text-sm font-medium">Font Size</label>
          </div>
          <Slider
            value={fontSize}
            onValueChange={setFontSize}
            max={24}
            min={12}
            step={1}
            className="w-full"
            aria-label="Adjust font size"
          />
          <div className="text-xs text-muted-foreground">Current: {fontSize[0]}px</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            <label className="text-sm font-medium">Sound Effects</label>
          </div>
          <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} aria-label="Toggle sound effects" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Keyboard className="h-4 w-4" />
            <label className="text-sm font-medium">Keyboard Navigation</label>
          </div>
          <Switch
            checked={keyboardNavigation}
            onCheckedChange={setKeyboardNavigation}
            aria-label="Toggle keyboard navigation"
          />
        </div>

        <Button variant="outline" onClick={resetToDefaults} className="w-full bg-transparent">
          Reset to Defaults
        </Button>
      </CardContent>
    </Card>
  )
}
