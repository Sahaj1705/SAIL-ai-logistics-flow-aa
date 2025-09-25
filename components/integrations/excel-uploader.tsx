"use client"

import { Label } from "@/components/ui/label"

import type React from "react"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Trash2,
  Eye,
  RefreshCw,
} from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  size: number
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  records: number
  errors: string[]
  uploadedAt: string
  type: "vessels" | "ports" | "schedules" | "costs" | "general"
}

interface ExcelUploaderProps {
  onFileProcessed?: (file: UploadedFile, data: any[]) => void
  onFileRemoved?: (fileId: string) => void
  acceptedTypes?: string[]
}

const mockFiles: UploadedFile[] = [
  {
    id: "1",
    name: "vessel_schedules_2024.xlsx",
    size: 2048576,
    status: "completed",
    progress: 100,
    records: 150,
    errors: [],
    uploadedAt: new Date(Date.now() - 3600000).toISOString(),
    type: "schedules",
  },
  {
    id: "2",
    name: "port_data.xlsx",
    size: 1024000,
    status: "completed",
    progress: 100,
    records: 45,
    errors: ["Row 23: Invalid port code", "Row 31: Missing coordinates"],
    uploadedAt: new Date(Date.now() - 7200000).toISOString(),
    type: "ports",
  },
]

export function ExcelUploader({
  onFileProcessed = () => {},
  onFileRemoved = () => {},
  acceptedTypes = [".xlsx", ".xls", ".csv"],
}: ExcelUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>(mockFiles)
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      handleFiles(selectedFiles)
    }
  }

  const handleFiles = (fileList: File[]) => {
    fileList.forEach((file) => {
      const newFile: UploadedFile = {
        id: `file-${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        status: "uploading",
        progress: 0,
        records: 0,
        errors: [],
        uploadedAt: new Date().toISOString(),
        type: detectFileType(file.name),
      }

      setFiles((prev) => [...prev, newFile])
      simulateUpload(newFile.id)
    })
  }

  const detectFileType = (filename: string): UploadedFile["type"] => {
    const name = filename.toLowerCase()
    if (name.includes("vessel") || name.includes("ship")) return "vessels"
    if (name.includes("port")) return "ports"
    if (name.includes("schedule")) return "schedules"
    if (name.includes("cost") || name.includes("price")) return "costs"
    return "general"
  }

  const simulateUpload = async (fileId: string) => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      setFiles((prev) => prev.map((file) => (file.id === fileId ? { ...file, progress } : file)))
    }

    // Simulate processing
    setFiles((prev) => prev.map((file) => (file.id === fileId ? { ...file, status: "processing" } : file)))

    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Complete processing
    const mockData = Array.from({ length: Math.floor(Math.random() * 100) + 50 }, (_, i) => ({
      id: i + 1,
      data: `Sample data row ${i + 1}`,
    }))

    const mockErrors =
      Math.random() > 0.7
        ? [
            `Row ${Math.floor(Math.random() * 50) + 1}: Invalid data format`,
            `Row ${Math.floor(Math.random() * 50) + 1}: Missing required field`,
          ]
        : []

    setFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? {
              ...file,
              status: "completed",
              records: mockData.length,
              errors: mockErrors,
            }
          : file,
      ),
    )

    const file = files.find((f) => f.id === fileId)
    if (file) {
      onFileProcessed({ ...file, records: mockData.length, errors: mockErrors }, mockData)
    }
  }

  const handleRemoveFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId))
    onFileRemoved(fileId)
  }

  const handleRetryFile = (fileId: string) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? {
              ...file,
              status: "uploading",
              progress: 0,
              errors: [],
            }
          : file,
      ),
    )
    simulateUpload(fileId)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "processing":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <Upload className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "error":
        return "destructive"
      case "processing":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "vessels":
        return "bg-blue-100 text-blue-800"
      case "ports":
        return "bg-green-100 text-green-800"
      case "schedules":
        return "bg-purple-100 text-purple-800"
      case "costs":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6" />
            Excel Uploader
          </h2>
          <p className="text-muted-foreground">Upload and process Excel/CSV files for logistics data</p>
        </div>
      </div>

      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="history">Upload History</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          {/* Upload Area */}
          <Card>
            <CardContent className="p-6">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Upload Excel Files</h3>
                <p className="text-muted-foreground mb-4">Drag and drop files here, or click to browse</p>
                <p className="text-sm text-muted-foreground mb-4">Supported formats: {acceptedTypes.join(", ")}</p>
                <input
                  type="file"
                  multiple
                  accept={acceptedTypes.join(",")}
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button asChild>
                    <span>Choose Files</span>
                  </Button>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Current Uploads */}
          {files.filter((f) => f.status === "uploading" || f.status === "processing").length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Current Uploads</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {files
                  .filter((f) => f.status === "uploading" || f.status === "processing")
                  .map((file) => (
                    <div key={file.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(file.status)}
                          <span className="font-medium">{file.name}</span>
                          <Badge variant="outline" className={getTypeColor(file.type)}>
                            {file.type}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{formatFileSize(file.size)}</span>
                      </div>
                      <Progress value={file.progress} className="h-2" />
                      <div className="text-sm text-muted-foreground">
                        {file.status === "uploading" ? "Uploading..." : "Processing..."}
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="space-y-4">
            <AnimatePresence>
              {files
                .filter((f) => f.status === "completed" || f.status === "error")
                .map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(file.status)}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{file.name}</span>
                                <Badge variant={getStatusBadge(file.status) as any}>{file.status}</Badge>
                                <Badge variant="outline" className={getTypeColor(file.type)}>
                                  {file.type}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {formatFileSize(file.size)} • {file.records} records •
                                {new Date(file.uploadedAt).toLocaleString()}
                              </div>
                              {file.errors.length > 0 && (
                                <div className="text-sm text-red-600 mt-1">{file.errors.length} error(s) found</div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => setSelectedFile(file)}>
                              <Eye className="h-3 w-3" />
                            </Button>
                            {file.status === "error" && (
                              <Button size="sm" variant="outline" onClick={() => handleRetryFile(file.id)}>
                                <RefreshCw className="h-3 w-3" />
                              </Button>
                            )}
                            <Button size="sm" variant="outline" onClick={() => handleRemoveFile(file.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {file.errors.length > 0 && (
                          <div className="mt-3 p-2 bg-red-50 rounded border">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                              <span className="text-sm font-medium text-red-700">Errors Found</span>
                            </div>
                            <ul className="text-sm text-red-600 space-y-1">
                              {file.errors.map((error, index) => (
                                <li key={index}>• {error}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: "Vessel Schedule Template",
                description: "Template for uploading vessel scheduling data",
                type: "schedules",
                fields: ["Vessel ID", "Port", "Arrival", "Departure", "Cargo"],
              },
              {
                name: "Port Data Template",
                description: "Template for port information and capacity data",
                type: "ports",
                fields: ["Port Code", "Name", "Coordinates", "Capacity", "Facilities"],
              },
              {
                name: "Cost Data Template",
                description: "Template for freight and operational costs",
                type: "costs",
                fields: ["Route", "Ocean Freight", "Port Handling", "Rail Cost", "Demurrage"],
              },
            ].map((template) => (
              <Card key={template.name}>
                <CardHeader>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                  <div>
                    <Label className="text-xs text-muted-foreground">Required Fields</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.fields.map((field) => (
                        <Badge key={field} variant="outline" className="text-xs">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button size="sm" className="w-full flex items-center gap-2">
                    <Download className="h-3 w-3" />
                    Download Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
