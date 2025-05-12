"use client"

import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AnalysesFiltersProps {
  statusFilter: string | null
  onStatusFilterChange: (status: string | null) => void
  companyFilter: string | null
  onCompanyFilterChange: (company: string | null) => void
  projectFilter: string | null
  onProjectFilterChange: (project: string | null) => void
  statuses: string[]
  companies: string[]
  projects: string[]
  onClearFilters: () => void
}

export function AnalysesFilters({
  statusFilter,
  onStatusFilterChange,
  companyFilter,
  onCompanyFilterChange,
  projectFilter,
  onProjectFilterChange,
  statuses,
  companies,
  projects,
  onClearFilters,
}: AnalysesFiltersProps) {
  const hasActiveFilters = statusFilter !== null || companyFilter !== null || projectFilter !== null

  return (
    <div className="mb-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
          <Select value={statusFilter || ""} onValueChange={(value) => onStatusFilterChange(value || null)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={companyFilter || ""} onValueChange={(value) => onCompanyFilterChange(value || null)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company} value={company}>
                  {company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={projectFilter || ""} onValueChange={(value) => onProjectFilterChange(value || null)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project} value={project}>
                  {project}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-9">
            <X className="h-4 w-4 mr-1.5" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {statusFilter && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {statusFilter}
              <button
                className="ml-1 hover:text-foreground"
                onClick={() => onStatusFilterChange(null)}
                aria-label="Remove status filter"
              >
                ×
              </button>
            </Badge>
          )}
          {companyFilter && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Company: {companyFilter}
              <button
                className="ml-1 hover:text-foreground"
                onClick={() => onCompanyFilterChange(null)}
                aria-label="Remove company filter"
              >
                ×
              </button>
            </Badge>
          )}
          {projectFilter && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Project: {projectFilter}
              <button
                className="ml-1 hover:text-foreground"
                onClick={() => onProjectFilterChange(null)}
                aria-label="Remove project filter"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
