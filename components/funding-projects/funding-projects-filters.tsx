"use client"

import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DeadlineOption {
  value: string
  label: string
}

interface FundingProjectsFiltersProps {
  sectorFilter: string | null
  onSectorFilterChange: (sector: string | null) => void
  deadlineFilter: string | null
  onDeadlineFilterChange: (deadline: string | null) => void
  sectors: string[]
  deadlineOptions: DeadlineOption[]
  onClearFilters: () => void
}

export function FundingProjectsFilters({
  sectorFilter,
  onSectorFilterChange,
  deadlineFilter,
  onDeadlineFilterChange,
  sectors,
  deadlineOptions,
  onClearFilters,
}: FundingProjectsFiltersProps) {
  const hasActiveFilters = sectorFilter !== null || deadlineFilter !== null

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
          <Select value={sectorFilter || ""} onValueChange={(value) => onSectorFilterChange(value || null)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Sector / Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              {sectors.map((sector) => (
                <SelectItem key={sector} value={sector}>
                  {sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={deadlineFilter || ""} onValueChange={(value) => onDeadlineFilterChange(value || null)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Deadline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Deadlines</SelectItem>
              {deadlineOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
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
          {sectorFilter && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Sector: {sectorFilter}
              <button
                className="ml-1 hover:text-foreground"
                onClick={() => onSectorFilterChange(null)}
                aria-label="Remove sector filter"
              >
                ×
              </button>
            </Badge>
          )}
          {deadlineFilter && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Deadline: {deadlineOptions.find((option) => option.value === deadlineFilter)?.label || deadlineFilter}
              <button
                className="ml-1 hover:text-foreground"
                onClick={() => onDeadlineFilterChange(null)}
                aria-label="Remove deadline filter"
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
