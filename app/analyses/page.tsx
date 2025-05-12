"use client"

import { useState, useEffect } from "react"
import { AnalysesHeader } from "@/components/analyses/analyses-header"
import { AnalysesFilters } from "@/components/analyses/analyses-filters"
import { AnalysesTable } from "@/components/analyses/analyses-table"
// Remove import of mock data
// import { analysesData } from "@/lib/analyses-data"
import type { Analysis, QuestionResponse } from "@/lib/analyses-data"

export default function AnalysesPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [companyFilter, setCompanyFilter] = useState<string | null>(null)
  const [projectFilter, setProjectFilter] = useState<string | null>(null)
  const [sortColumn, setSortColumn] = useState<string>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Fetch analyses from API
  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        setLoading(true)
        console.log('Fetching analyses from API...')
        
        const response = await fetch('/api/analyses', {
          cache: 'no-store',
          credentials: 'same-origin'
        })
        
        console.log('API response status:', response.status)
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('API error details:', errorData)
          
          throw new Error(`Failed to fetch analyses: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        console.log(`Received ${data.length} analyses from API`)
        
        // Process the data to ensure questions field is properly formatted
        const processedData = data.map((analysis: any) => {
          // If questions is an array, convert it to a number for the table display
          if (Array.isArray(analysis.questions)) {
            return {
              ...analysis,
              // Keep the original questions array for later use if needed
              rawQuestions: analysis.questions,
              // Number of questions - what the table component expects
              questions: analysis.questions.length
            };
          }
          return analysis;
        });
        
        setAnalyses(processedData)
      } catch (err) {
        console.error('Error fetching analyses:', err)
        setError(err instanceof Error ? err.message : 'Failed to load analyses. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyses()
  }, [])

  // Get unique values for filters
  const statuses = Array.from(new Set(analyses.map((analysis) => analysis.status)))
  const companies = Array.from(new Set(analyses.map((analysis) => analysis.company?.name).filter(Boolean)))
  const projects = Array.from(new Set(analyses.map((analysis) => analysis.project?.name).filter(Boolean)))

  // Filter analyses based on search query and filters
  const filteredAnalyses = analyses.filter((analysis) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      analysis.company?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      analysis.project?.name?.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus = !statusFilter || analysis.status === statusFilter

    // Company filter
    const matchesCompany = !companyFilter || analysis.company?.name === companyFilter

    // Project filter
    const matchesProject = !projectFilter || analysis.project?.name === projectFilter

    return matchesSearch && matchesStatus && matchesCompany && matchesProject
  })

  // Sort analyses
  const sortedAnalyses = [...filteredAnalyses].sort((a, b) => {
    let comparison = 0

    switch (sortColumn) {
      case "company":
        comparison = (a.company?.name || "").localeCompare(b.company?.name || "")
        break
      case "project":
        comparison = (a.project?.name || "").localeCompare(b.project?.name || "")
        break
      case "date":
        comparison = new Date(a.date || "").getTime() - new Date(b.date || "").getTime()
        break
      case "status":
        comparison = (a.status || "").localeCompare(b.status || "")
        break
      default:
        comparison = 0
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  // Paginate analyses
  const totalPages = Math.ceil(sortedAnalyses.length / itemsPerPage)
  const paginatedAnalyses = sortedAnalyses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Handle sort - mark as action
  const handleSortAction = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Handle page change - mark as action
  const handlePageChangeAction = (page: number) => {
    setCurrentPage(page)
  }

  // Search change handler - mark as action
  const handleSearchChangeAction = (query: string) => {
    setSearchQuery(query)
  }

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter(null)
    setCompanyFilter(null)
    setProjectFilter(null)
    setSearchQuery("")
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <p className="mt-2 text-sm">
            <button 
              className="underline font-medium"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">

      <AnalysesHeader 
        searchQuery={searchQuery} 
        onSearchChangeAction={handleSearchChangeAction} 
      />

      <div className="w-full px-6 py-6 pb-16">
        <AnalysesFilters
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          companyFilter={companyFilter}
          onCompanyFilterChange={setCompanyFilter}
          projectFilter={projectFilter}
          onProjectFilterChange={setProjectFilter}
          statuses={statuses}
          companies={companies}
          projects={projects}
          onClearFilters={clearFilters}
        />

        <AnalysesTable
          analyses={paginatedAnalyses}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSortAction={handleSortAction}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChangeAction={handlePageChangeAction}
        />
      </div>
    </div>
  )
}
