"use client"

import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Eye, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { Analysis } from "@/lib/analyses-data"
import Link from "next/link"

interface AnalysesTableProps {
  analyses: Analysis[]
  sortColumn: string
  sortDirection: "asc" | "desc"
  onSortAction: (column: string) => void
  currentPage: number
  totalPages: number
  onPageChangeAction: (page: number) => void
}

export function AnalysesTable({
  analyses,
  sortColumn,
  sortDirection,
  onSortAction,
  currentPage,
  totalPages,
  onPageChangeAction,
}: AnalysesTableProps) {
  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "Pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      case "Needs Review":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300"
    }
  }

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  // Render sort indicator
  const renderSortIndicator = (column: string) => {
    if (sortColumn !== column) return null

    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />
  }

  return (
    <Card className="border shadow-sm w-full">
      <div className="overflow-x-auto max-h-[70vh] overflow-y-auto w-full">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-slate-50 dark:bg-slate-800/50">
              <th
                className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer"
                onClick={() => onSortAction("company")}
              >
                <div className="flex items-center">
                  Company
                  {renderSortIndicator("company")}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer"
                onClick={() => onSortAction("project")}
              >
                <div className="flex items-center">
                  Funding Project
                  {renderSortIndicator("project")}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer"
                onClick={() => onSortAction("date")}
              >
                <div className="flex items-center">
                  Date
                  {renderSortIndicator("date")}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-medium text-muted-foreground cursor-pointer"
                onClick={() => onSortAction("status")}
              >
                <div className="flex items-center">
                  Status
                  {renderSortIndicator("status")}
                </div>
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {analyses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No analyses found. Try adjusting your filters.
                </td>
              </tr>
            ) : (
              analyses.map((analysis) => (
                <tr
                  key={analysis.id}
                  className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {analysis.company.logo ? (
                          <AvatarImage src={analysis.company.logo || "/placeholder.svg"} alt={analysis.company.name} />
                        ) : (
                          <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {getInitials(analysis.company.name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="font-medium">{analysis.company.name}</div>
                        <div className="text-xs text-muted-foreground">{analysis.company.sector}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{analysis.project.name}</div>
                    <div className="text-xs text-muted-foreground">
                      €{analysis.project.fundingAmount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>{formatDate(analysis.date)}</div>
                    <div className="text-xs text-muted-foreground">
                      {analysis.completionDate ? `Completed: ${formatDate(analysis.completionDate)}` : ""}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={getStatusColor(analysis.status)}>
                      {analysis.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {analysis.completedQuestions} / {analysis.questions} questions
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/analyses/${analysis.id}`}>
                          <Eye className="h-4 w-4 mr-1.5" />
                          View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/analyses/${analysis.id}/edit`}>
                          <Edit2 className="h-4 w-4 mr-1.5" />
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {analyses.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChangeAction(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChangeAction(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
