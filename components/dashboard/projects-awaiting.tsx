"use client"

import { ArrowRight, Clock, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface AwaitingProject {
  id: string
  projectTitle: string
  companyName: string
  deadline: string
  status: string
  progress: number
  sectionsCompleted: number
  totalSections: number
}

interface ProjectsAwaitingProps {
  projects: AwaitingProject[]
}

export function ProjectsAwaiting({ projects }: ProjectsAwaitingProps) {
  // Calculate days remaining until deadline
  const getDaysRemaining = (deadline: string) => {
    const deadlineDate = new Date(deadline)
    const today = new Date()
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Awaiting AI Writing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "Under Review":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300"
    }
  }

  return (
    <Card className="border shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Clock className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
          Projects Awaiting Action
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {projects.map((project) => {
            const daysRemaining = getDaysRemaining(project.deadline)
            const isUrgent = daysRemaining <= 14

            return (
              <div key={project.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{project.projectTitle}</h3>
                  <Badge variant="outline" className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="text-muted-foreground">{project.companyName}</div>
                  <div className="flex items-center">
                    {isUrgent && <AlertCircle className="h-3.5 w-3.5 mr-1 text-red-500" />}
                    <span className={isUrgent ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}>
                      Deadline: {formatDate(project.deadline)} ({daysRemaining} days)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Progress value={project.progress} className="h-2 flex-1" />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {project.sectionsCompleted}/{project.totalSections} sections
                  </span>
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
