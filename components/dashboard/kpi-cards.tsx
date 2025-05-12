"use client"

import { FileText, Building2, PieChart, FileQuestion, Send, Clock, CheckCircle, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface KpiCardsProps {
  totalProjects: number
  totalCompanies: number
  successRate: number
  totalAnalyses: number
  totalApplicationsSubmitted: number
  activeApplications: number
  completedProjects: number
  upcomingDeadlines: number
}

export function KpiCards({
  totalProjects,
  totalCompanies,
  successRate,
  totalAnalyses,
  totalApplicationsSubmitted,
  activeApplications,
  completedProjects,
  upcomingDeadlines,
}: KpiCardsProps) {
  const kpis = [
    {
      title: "Total Projects",
      value: totalProjects,
      change: "+12%",
      isPositive: true,
      icon: FileText,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      title: "Total Companies",
      value: totalCompanies,
      change: "+5%",
      isPositive: true,
      icon: Building2,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      title: "Success Rate",
      value: `${successRate}%`,
      change: "+2%",
      isPositive: true,
      icon: PieChart,
      color: "text-violet-600 dark:text-violet-400",
      bgColor: "bg-violet-50 dark:bg-violet-950/30",
    },
    {
      title: "Total Analyses",
      value: totalAnalyses,
      change: "+18%",
      isPositive: true,
      icon: FileQuestion,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      title: "Applications Submitted",
      value: totalApplicationsSubmitted,
      change: "+8%",
      isPositive: true,
      icon: Send,
      color: "text-cyan-600 dark:text-cyan-400",
      bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
    },
    {
      title: "Active Applications",
      value: activeApplications,
      change: "+15%",
      isPositive: true,
      icon: Clock,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
    },
    {
      title: "Completed Projects",
      value: completedProjects,
      change: "+7%",
      isPositive: true,
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/30",
    },
    {
      title: "Upcoming Deadlines",
      value: upcomingDeadlines,
      change: "-3%",
      isPositive: false,
      icon: Calendar,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950/30",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <Card key={index} className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                <h3 className="text-2xl font-bold mt-1">{kpi.value}</h3>
                <p
                  className={`text-xs mt-1 ${kpi.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {kpi.change} from last month
                </p>
              </div>
              <div className={`${kpi.bgColor} p-3 rounded-full`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
