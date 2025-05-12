"use client"

import { Calendar, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Project {
  id: string
  title: string
  deadline: string
  fundingAmount: number
  sector: string
  status: "active" | "completed" | "pending"
}

interface RecentProjectsProps {
  projects: Project[]
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  // Function to calculate days remaining
  const getDaysRemaining = (deadline: string) => {
    const deadlineDate = new Date(deadline)
    const today = new Date()
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300"
    }
  }

  return (
    <Card className="border shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Recent Funding Projects</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {projects.map((project) => {
            const daysRemaining = getDaysRemaining(project.deadline)

            return (
              <div key={project.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{project.title}</h3>
                  <Badge variant="outline" className={getStatusColor(project.status)}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 mr-1.5" />
                      {daysRemaining <= 0 ? (
                        <span className="text-red-600 dark:text-red-400">Deadline passed</span>
                      ) : (
                        <span>{daysRemaining} days remaining</span>
                      )}
                    </div>
                    <div className="text-muted-foreground">€{project.fundingAmount.toLocaleString()}</div>
                  </div>

                  <Badge variant="secondary" className="text-xs">
                    {project.sector}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <Button variant="ghost" size="sm" className="ml-auto text-xs">
          View All Projects <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  )
}
