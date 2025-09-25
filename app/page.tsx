"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Ship, BarChart3, Calendar, MapPin, Settings, Zap } from "lucide-react"
import { motion } from "framer-motion"

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <Ship className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-foreground">AI Logistics Flow</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Intelligent port operations, vessel optimization, and supply chain management powered by AI
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: BarChart3,
              title: "Dashboard",
              description: "Real-time analytics and KPI monitoring",
              href: "/dashboard",
            },
            {
              icon: Zap,
              title: "Optimize",
              description: "AI-powered route and cost optimization",
              href: "/optimize",
            },
            {
              icon: Calendar,
              title: "Scheduler",
              description: "Interactive Gantt charts and vessel scheduling",
              href: "/scheduler",
            },
            {
              icon: MapPin,
              title: "Port & Plant",
              description: "Port congestion and plant flow visualization",
              href: "/port-plant",
            },
            {
              icon: Settings,
              title: "Operations",
              description: "Live operations console and alerts",
              href: "/operations",
            },
            {
              icon: Ship,
              title: "Vessel Tracking",
              description: "Real-time vessel positions and routes",
              href: "/vessels",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card
                className="h-full hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(feature.href)}
              >
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    Access Module
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Button size="lg" onClick={() => router.push("/auth")}>
            Get Started
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
