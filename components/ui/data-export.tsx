"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, FileText, Table } from "lucide-react"

interface DataExportProps {
  data: any[]
  filename?: string
  onExport?: (format: string, data: any[]) => void
}

export function DataExport({ data, filename = "export", onExport }: DataExportProps) {
  const [format, setFormat] = useState("csv")
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [includeHeaders, setIncludeHeaders] = useState(true)

  const availableFields = data.length > 0 ? Object.keys(data[0]) : []

  const handleExport = () => {
    const exportData =
      selectedFields.length > 0
        ? data.map((item) => {
            const filtered: any = {}
            selectedFields.forEach((field) => {
              filtered[field] = item[field]
            })
            return filtered
          })
        : data

    if (format === "csv") {
      exportToCSV(exportData)
    } else if (format === "pdf") {
      exportToPDF(exportData)
    }

    onExport?.(format, exportData)
  }

  const exportToCSV = (data: any[]) => {
    if (data.length === 0) return

    const headers = Object.keys(data[0])
    const csvContent = [
      includeHeaders ? headers.join(",") : "",
      ...data.map((row) => headers.map((header) => JSON.stringify(row[header] || "")).join(",")),
    ]
      .filter(Boolean)
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportToPDF = (data: any[]) => {
    // Simple PDF export - in production, use a proper PDF library
    const content = data
      .map((item) =>
        Object.entries(item)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n"),
      )
      .join("\n\n")

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const toggleField = (field: string) => {
    setSelectedFields((prev) => (prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Export Format</label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">
                <div className="flex items-center gap-2">
                  <Table className="h-4 w-4" />
                  CSV
                </div>
              </SelectItem>
              <SelectItem value="pdf">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  PDF
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {availableFields.length > 0 && (
          <div>
            <label className="text-sm font-medium mb-2 block">Fields to Export</label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {availableFields.map((field) => (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox
                    id={field}
                    checked={selectedFields.includes(field)}
                    onCheckedChange={() => toggleField(field)}
                  />
                  <label htmlFor={field} className="text-sm capitalize">
                    {field.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelectedFields(availableFields)} className="mt-2">
              Select All
            </Button>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox id="headers" checked={includeHeaders} onCheckedChange={setIncludeHeaders} />
          <label htmlFor="headers" className="text-sm">
            Include headers
          </label>
        </div>

        <Button onClick={handleExport} className="w-full">
          <Download className="h-4 w-4 mr-2" />
          Export {format.toUpperCase()}
        </Button>
      </CardContent>
    </Card>
  )
}
