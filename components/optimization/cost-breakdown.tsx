"use client"

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface CostBreakdownProps {
  result: any
}

const costCategories = [
  { name: "Ocean Freight", value: 45000, color: "#3b82f6" },
  { name: "Port Handling", value: 12000, color: "#10b981" },
  { name: "Rail Transport", value: 8000, color: "#f59e0b" },
  { name: "Demurrage", value: 3500, color: "#ef4444" },
  { name: "Insurance", value: 2500, color: "#8b5cf6" },
]

const routeCosts = [
  { route: "Route A", oceanFreight: 45000, portHandling: 12000, rail: 8000, demurrage: 3500 },
  { route: "Route B", oceanFreight: 42000, portHandling: 13500, rail: 7500, demurrage: 4200 },
  { route: "Route C", oceanFreight: 48000, portHandling: 11000, rail: 8500, demurrage: 2800 },
]

export function CostBreakdown({ result }: CostBreakdownProps) {
  return (
    <div className="w-full h-full space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* Cost Distribution Pie Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Cost Distribution</h3>
          <ChartContainer
            config={{
              oceanFreight: { label: "Ocean Freight", color: "#3b82f6" },
              portHandling: { label: "Port Handling", color: "#10b981" },
              rail: { label: "Rail Transport", color: "#f59e0b" },
              demurrage: { label: "Demurrage", color: "#ef4444" },
              insurance: { label: "Insurance", color: "#8b5cf6" },
            }}
            className="h-[250px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {costCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Route Comparison */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Route Comparison</h3>
          <ChartContainer
            config={{
              oceanFreight: { label: "Ocean Freight", color: "#3b82f6" },
              portHandling: { label: "Port Handling", color: "#10b981" },
              rail: { label: "Rail Transport", color: "#f59e0b" },
              demurrage: { label: "Demurrage", color: "#ef4444" },
            }}
            className="h-[250px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={routeCosts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="route" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="oceanFreight" stackId="a" fill="var(--color-oceanFreight)" />
                <Bar dataKey="portHandling" stackId="a" fill="var(--color-portHandling)" />
                <Bar dataKey="rail" stackId="a" fill="var(--color-rail)" />
                <Bar dataKey="demurrage" stackId="a" fill="var(--color-demurrage)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>

      {/* Cost Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {costCategories.map((category) => (
          <div key={category.name} className="text-center">
            <div className="text-lg font-bold" style={{ color: category.color }}>
              ${(category.value / 1000).toFixed(0)}K
            </div>
            <div className="text-xs text-muted-foreground">{category.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
