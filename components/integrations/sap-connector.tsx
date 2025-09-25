"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Database,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  Download,
  Upload,
  AlertTriangle,
  Clock,
} from "lucide-react"

interface SAPConnection {
  id: string
  name: string
  host: string
  client: string
  status: "connected" | "disconnected" | "error"
  lastSync: string
  modules: string[]
}

interface SAPConnectorProps {
  onDataSync?: (data: any) => void
  onConnectionChange?: (status: string) => void
}

const mockConnections: SAPConnection[] = [
  {
    id: "sap-prod",
    name: "SAP Production",
    host: "sap-prod.company.com",
    client: "100",
    status: "connected",
    lastSync: new Date(Date.now() - 300000).toISOString(),
    modules: ["MM", "SD", "WM", "FI"],
  },
  {
    id: "sap-dev",
    name: "SAP Development",
    host: "sap-dev.company.com",
    client: "200",
    status: "disconnected",
    lastSync: new Date(Date.now() - 3600000).toISOString(),
    modules: ["MM", "SD"],
  },
]

export function SAPConnector({ onDataSync = () => {}, onConnectionChange = () => {} }: SAPConnectorProps) {
  const [connections, setConnections] = useState<SAPConnection[]>(mockConnections)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [newConnection, setNewConnection] = useState({
    name: "",
    host: "",
    client: "",
    username: "",
    password: "",
  })

  const handleConnect = async (connectionId: string) => {
    setIsConnecting(true)

    // Simulate connection process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setConnections((prev) =>
      prev.map((conn) =>
        conn.id === connectionId ? { ...conn, status: "connected" as const, lastSync: new Date().toISOString() } : conn,
      ),
    )

    setIsConnecting(false)
    onConnectionChange("connected")
  }

  const handleDisconnect = (connectionId: string) => {
    setConnections((prev) =>
      prev.map((conn) => (conn.id === connectionId ? { ...conn, status: "disconnected" as const } : conn)),
    )
    onConnectionChange("disconnected")
  }

  const handleSync = async (connectionId: string) => {
    setIsSyncing(true)

    // Simulate data sync
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const mockData = {
      materials: 150,
      orders: 45,
      shipments: 23,
      inventory: 89,
    }

    setConnections((prev) =>
      prev.map((conn) => (conn.id === connectionId ? { ...conn, lastSync: new Date().toISOString() } : conn)),
    )

    setIsSyncing(false)
    onDataSync(mockData)
  }

  const handleAddConnection = () => {
    const connection: SAPConnection = {
      id: `sap-${Date.now()}`,
      name: newConnection.name,
      host: newConnection.host,
      client: newConnection.client,
      status: "disconnected",
      lastSync: new Date().toISOString(),
      modules: ["MM", "SD"],
    }

    setConnections((prev) => [...prev, connection])
    setNewConnection({ name: "", host: "", client: "", username: "", password: "" })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "text-green-500"
      case "error":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return "default"
      case "error":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4" />
      case "error":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Database className="h-6 w-6" />
            SAP Connector
          </h2>
          <p className="text-muted-foreground">Manage SAP system connections and data synchronization</p>
        </div>
      </div>

      <Tabs defaultValue="connections" className="space-y-4">
        <TabsList>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="sync">Data Sync</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {connections.map((connection) => (
              <motion.div key={connection.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{connection.name}</CardTitle>
                      <Badge variant={getStatusBadge(connection.status) as any}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(connection.status)}
                          {connection.status}
                        </div>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Host:</span>
                        <span className="font-mono">{connection.host}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Client:</span>
                        <span className="font-mono">{connection.client}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Sync:</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(connection.lastSync).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm text-muted-foreground">Active Modules</Label>
                      <div className="flex gap-1 mt-1">
                        {connection.modules.map((module) => (
                          <Badge key={module} variant="outline" className="text-xs">
                            {module}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {connection.status === "connected" ? (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleDisconnect(connection.id)}>
                            Disconnect
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSync(connection.id)}
                            disabled={isSyncing}
                            className="flex items-center gap-1"
                          >
                            {isSyncing ? (
                              <RefreshCw className="h-3 w-3 animate-spin" />
                            ) : (
                              <RefreshCw className="h-3 w-3" />
                            )}
                            Sync
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleConnect(connection.id)}
                          disabled={isConnecting}
                          className="flex items-center gap-1"
                        >
                          {isConnecting ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : (
                            <CheckCircle className="h-3 w-3" />
                          )}
                          Connect
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Add New Connection */}
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-lg">Add New Connection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Connection Name</Label>
                  <Input
                    id="name"
                    value={newConnection.name}
                    onChange={(e) => setNewConnection((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="SAP Production"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="host">Host</Label>
                  <Input
                    id="host"
                    value={newConnection.host}
                    onChange={(e) => setNewConnection((prev) => ({ ...prev, host: e.target.value }))}
                    placeholder="sap.company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
                  <Input
                    id="client"
                    value={newConnection.client}
                    onChange={(e) => setNewConnection((prev) => ({ ...prev, client: e.target.value }))}
                    placeholder="100"
                  />
                </div>
                <Button
                  onClick={handleAddConnection}
                  disabled={!newConnection.name || !newConnection.host || !newConnection.client}
                  className="w-full"
                >
                  Add Connection
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Synchronization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: "Materials", count: 1250, lastSync: "2 min ago" },
                  { name: "Purchase Orders", count: 89, lastSync: "5 min ago" },
                  { name: "Shipments", count: 34, lastSync: "1 min ago" },
                  { name: "Inventory", count: 567, lastSync: "3 min ago" },
                ].map((item) => (
                  <Card key={item.name}>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{item.count}</div>
                        <div className="text-sm text-muted-foreground">{item.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">Last sync: {item.lastSync}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-2">
                <Button className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Upload className="h-4 w-4" />
                  Import Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Connection Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sync-interval">Auto Sync Interval (minutes)</Label>
                <Input id="sync-interval" type="number" defaultValue="15" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeout">Connection Timeout (seconds)</Label>
                <Input id="timeout" type="number" defaultValue="30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="retry-attempts">Retry Attempts</Label>
                <Input id="retry-attempts" type="number" defaultValue="3" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="log-level">Log Level</Label>
                <select className="w-full p-2 border rounded">
                  <option value="info">Info</option>
                  <option value="debug">Debug</option>
                  <option value="error">Error</option>
                </select>
              </div>
              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
