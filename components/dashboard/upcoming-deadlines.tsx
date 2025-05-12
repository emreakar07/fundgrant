"use client"

import { ArrowRight, Calendar, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface Deadline {
  id: string
  projectTitle: string
  companyName: string
  deadline: string
  daysRemaining: number
  progress: number
}

interface UpcomingDeadlinesProps {
  deadlines: Deadline[]
}

export function UpcomingDeadlines({ deadlines }: UpcomingDeadlinesProps) {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  // Get progress color
  const getProgressColor = (progress: number, daysRemaining: number) => {
    if (daysRemaining <= 7) {
      return progress < 70 ? "bg-red-600" : "bg-amber-500"
    }
    if (progress >= 80) return "bg-green-600"
    if (progress >= 50) return "bg-blue-600"
    return "bg-amber-500"
  }

  return (
    <Card className="border shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-red-600 dark:text-red-400" />
          Upcoming Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {deadlines.map((deadline) => (
            <div key={deadline.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{deadline.projectTitle}</h3>
                <div className="flex items-center">
                  {deadline.daysRemaining <= 7 && <AlertCircle className="h-4 w-4 mr-1.5 text-red-500" />}
                  <span
                    className={
                      deadline.daysRemaining <= 7
                        ? "text-red-600 dark:text-red-400 font-medium"
                        : "text-amber-600 dark:text-amber-400"
                    }
                  >
                    {deadline.daysRemaining} days left
                  </span>
                </div>
              </div>

              <div className="text-sm text-muted-foreground mb-2">
                {deadline.companyName} • Deadline: {formatDate(deadline.deadline)}
              </div>

              <div className="flex items-center gap-2">
                <Progress
                  value={deadline.progress}
                  className="h-2 flex-1"
                  indicatorClassName={getProgressColor(deadline.progress, deadline.daysRemaining)}
                />
                <span className="text-xs font-medium">{deadline.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <Button variant="ghost" size="sm" className="ml-auto text-xs">
          View All Deadlines <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  )
}
