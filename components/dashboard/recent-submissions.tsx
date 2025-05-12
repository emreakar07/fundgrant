"use client"

import { ArrowRight, Calendar, Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Submission {
  id: string
  projectTitle: string
  companyName: string
  submissionDate: string
  status: string
  fundingAmount: number
}

interface RecentSubmissionsProps {
  submissions: Submission[]
}

export function RecentSubmissions({ submissions }: RecentSubmissionsProps) {
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
      case "Approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "Under Review":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      case "Submitted":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300"
    }
  }

  return (
    <Card className="border shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Send className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
          Recently Submitted Applications
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {submissions.map((submission) => (
            <div key={submission.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{submission.projectTitle}</h3>
                <Badge variant="outline" className={getStatusColor(submission.status)}>
                  {submission.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="text-muted-foreground">{submission.companyName}</div>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    {formatDate(submission.submissionDate)}
                  </div>
                </div>

                <div className="text-muted-foreground">€{submission.fundingAmount.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <Button variant="ghost" size="sm" className="ml-auto text-xs">
          View All Submissions <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  )
}
