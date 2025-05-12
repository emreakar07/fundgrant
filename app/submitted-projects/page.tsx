"use client"

import { useState } from "react"
import { SubmittedProjectsHeader } from "@/components/submitted-projects/submitted-projects-header"
import { SubmittedProjectsFilters } from "@/components/submitted-projects/submitted-projects-filters"
import { SubmittedProjectsTable } from "@/components/submitted-projects/submitted-projects-table"
import { submittedProjectsData } from "@/lib/submitted-projects-data"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function SubmittedProjectsPage() {
  const [filteredProjects, setFilteredProjects] = useState(submittedProjectsData)
  const [currentPage, setCurrentPage] = useState(1)
  const projectsPerPage = 5

  const handleFilterChange = (filters: {
    search: string
    company: string
    project: string
    status: string
    dateRange: { from: Date | undefined; to: Date | undefined }
  }) => {
    let filtered = [...submittedProjectsData]

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (project) =>
          project.companyName.toLowerCase().includes(searchLower) ||
          project.projectName.toLowerCase().includes(searchLower) ||
          project.submittedByName.toLowerCase().includes(searchLower),
      )
    }

    // Apply company filter
    if (filters.company) {
      filtered = filtered.filter((project) => project.companyName === filters.company)
    }

    // Apply project filter
    if (filters.project) {
      filtered = filtered.filter((project) => project.projectName === filters.project)
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter((project) => project.status === filters.status)
    }

    // Apply date range filter
    if (filters.dateRange.from && filters.dateRange.to) {
      filtered = filtered.filter((project) => {
        const submissionDate = new Date(project.submissionDate)
        return submissionDate >= filters.dateRange.from! && submissionDate <= filters.dateRange.to!
      })
    }

    setFilteredProjects(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }

  // Calculate pagination
  const indexOfLastProject = currentPage * projectsPerPage
  const indexOfFirstProject = indexOfLastProject - projectsPerPage
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject)
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <SubmittedProjectsHeader />
      <SubmittedProjectsFilters onFilterChange={handleFilterChange} />
      <SubmittedProjectsTable projects={currentProjects} />

      {/* Pagination */}
      {filteredProjects.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstProject + 1} to {Math.min(indexOfLastProject, filteredProjects.length)} of{" "}
            {filteredProjects.length} projects
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <div className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
