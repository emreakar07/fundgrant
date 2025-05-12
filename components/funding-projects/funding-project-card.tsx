"use client"

import { Calendar, ArrowRight, Tag } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import type { FundingProject } from "@/lib/funding-projects-data"

interface FundingProjectCardProps {
  project: FundingProject
}

export function FundingProjectCard({ project }: FundingProjectCardProps) {
  const router = useRouter()

  // Calculate days remaining until deadline
  const getDaysRemaining = () => {
    const deadlineDate = new Date(project.deadline)
    const today = new Date()
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysRemaining = getDaysRemaining()

  // Get deadline status color
  const getDeadlineStatusColor = () => {
    if (daysRemaining <= 0) {
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
    } else if (daysRemaining <= 30) {
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
    } else if (daysRemaining <= 90) {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
    } else {
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
    }
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

  const handleViewDetails = () => {
    router.push(`/funding-projects/${project.id}`)
  }

  return (
    <Card className="border shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      <CardContent className="p-5 flex-1">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-lg">{project.title}</h3>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {project.sector}
          </Badge>
          <Badge variant="outline" className={getDeadlineStatusColor()}>
            <Calendar className="h-3 w-3 mr-1" />
            {daysRemaining <= 0
              ? "Deadline passed"
              : daysRemaining === 1
                ? "1 day remaining"
                : `${daysRemaining} days remaining`}
          </Badge>
        </div>

        <div className="text-sm text-muted-foreground mb-3">
          <div className="font-medium text-foreground">€{project.fundingAmount.toLocaleString()}</div>
          <div className="text-xs">Deadline: {formatDate(project.deadline)}</div>
        </div>

        <p className="text-sm line-clamp-3">{project.description}</p>
      </CardContent>

      <CardFooter className="border-t p-3 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-muted-foreground">{project.eligibilityCriteria.length} eligibility criteria</div>
          <Button variant="ghost" size="sm" onClick={handleViewDetails}>
            View Details <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
