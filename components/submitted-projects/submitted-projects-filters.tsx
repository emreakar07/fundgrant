"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface SubmittedProjectsFiltersProps {
  onFilterChange: (filters: {
    search: string
    company: string
    project: string
    status: string
    dateRange: { from: Date | undefined; to: Date | undefined }
  }) => void
}

export function SubmittedProjectsFilters({ onFilterChange }: SubmittedProjectsFiltersProps) {
  const [search, setSearch] = useState("")
  const [company, setCompany] = useState("")
  const [project, setProject] = useState("")
  const [status, setStatus] = useState("")
  const [date, setDate] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })

  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const handleFilterChange = (type: string, value: string | { from: Date | undefined; to: Date | undefined }) => {
    let newActiveFilters = [...activeFilters]

    if (type === "search" && typeof value === "string") {
      setSearch(value)
      if (value && !newActiveFilters.some((f) => f.startsWith("Search:"))) {
        newActiveFilters.push(`Search: ${value}`)
      } else if (!value) {
        newActiveFilters = newActiveFilters.filter((f) => !f.startsWith("Search:"))
      } else {
        newActiveFilters = newActiveFilters.map((f) => (f.startsWith("Search:") ? `Search: ${value}` : f))
      }
    }

    if (type === "company" && typeof value === "string") {
      setCompany(value)
      if (value && !newActiveFilters.some((f) => f.startsWith("Company:"))) {
        newActiveFilters.push(`Company: ${value}`)
      } else if (!value) {
        newActiveFilters = newActiveFilters.filter((f) => !f.startsWith("Company:"))
      } else {
        newActiveFilters = newActiveFilters.map((f) => (f.startsWith("Company:") ? `Company: ${value}` : f))
      }
    }

    if (type === "project" && typeof value === "string") {
      setProject(value)
      if (value && !newActiveFilters.some((f) => f.startsWith("Project:"))) {
        newActiveFilters.push(`Project: ${value}`)
      } else if (!value) {
        newActiveFilters = newActiveFilters.filter((f) => !f.startsWith("Project:"))
      } else {
        newActiveFilters = newActiveFilters.map((f) => (f.startsWith("Project:") ? `Project: ${value}` : f))
      }
    }

    if (type === "status" && typeof value === "string") {
      setStatus(value)
      if (value && !newActiveFilters.some((f) => f.startsWith("Status:"))) {
        newActiveFilters.push(`Status: ${value}`)
      } else if (!value) {
        newActiveFilters = newActiveFilters.filter((f) => !f.startsWith("Status:"))
      } else {
        newActiveFilters = newActiveFilters.map((f) => (f.startsWith("Status:") ? `Status: ${value}` : f))
      }
    }

    if (type === "date" && typeof value !== "string") {
      setDate(value)
      const dateFilter = newActiveFilters.findIndex((f) => f.startsWith("Date:"))

      if (value.from && value.to) {
        const dateString = `Date: ${format(value.from, "PP")} - ${format(value.to, "PP")}`
        if (dateFilter >= 0) {
          newActiveFilters[dateFilter] = dateString
        } else {
          newActiveFilters.push(dateString)
        }
      } else if (dateFilter >= 0) {
        newActiveFilters.splice(dateFilter, 1)
      }
    }

    setActiveFilters(newActiveFilters)

    onFilterChange({
      search,
      company,
      project,
      status,
      dateRange: date,
    })
  }

  const clearFilter = (filter: string) => {
    if (filter.startsWith("Search:")) {
      setSearch("")
      handleFilterChange("search", "")
    } else if (filter.startsWith("Company:")) {
      setCompany("")
      handleFilterChange("company", "")
    } else if (filter.startsWith("Project:")) {
      setProject("")
      handleFilterChange("project", "")
    } else if (filter.startsWith("Status:")) {
      setStatus("")
      handleFilterChange("status", "")
    } else if (filter.startsWith("Date:")) {
      setDate({ from: undefined, to: undefined })
      handleFilterChange("date", { from: undefined, to: undefined })
    }

    setActiveFilters(activeFilters.filter((f) => f !== filter))
  }

  const clearAllFilters = () => {
    setSearch("")
    setCompany("")
    setProject("")
    setStatus("")
    setDate({ from: undefined, to: undefined })
    setActiveFilters([])

    onFilterChange({
      search: "",
      company: "",
      project: "",
      status: "",
      dateRange: { from: undefined, to: undefined },
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center space-x-2">
          <Select value={company} onValueChange={(value) => handleFilterChange("company", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_companies">All Companies</SelectItem>
              <SelectItem value="EcoTech Solutions">EcoTech Solutions</SelectItem>
              <SelectItem value="BioMed Research">BioMed Research</SelectItem>
              <SelectItem value="AgriTech Innovations">AgriTech Innovations</SelectItem>
              <SelectItem value="QuantumTech">QuantumTech</SelectItem>
              <SelectItem value="Urban Mobility Solutions">Urban Mobility Solutions</SelectItem>
              <SelectItem value="CleanWater Tech">CleanWater Tech</SelectItem>
              <SelectItem value="HealthTech Innovations">HealthTech Innovations</SelectItem>
              <SelectItem value="RenewEnergy Corp">RenewEnergy Corp</SelectItem>
              <SelectItem value="SmartFarm Systems">SmartFarm Systems</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Select value={project} onValueChange={(value) => handleFilterChange("project", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_projects">All Projects</SelectItem>
              <SelectItem value="EU Green Innovation Fund">EU Green Innovation Fund</SelectItem>
              <SelectItem value="Horizon Europe Health Grant">Horizon Europe Health Grant</SelectItem>
              <SelectItem value="Rural Development Fund">Rural Development Fund</SelectItem>
              <SelectItem value="Digital Innovation Fund">Digital Innovation Fund</SelectItem>
              <SelectItem value="Smart Cities Grant">Smart Cities Grant</SelectItem>
              <SelectItem value="Environmental Protection Fund">Environmental Protection Fund</SelectItem>
              <SelectItem value="Climate Action Grant">Climate Action Grant</SelectItem>
              <SelectItem value="Medical Research Grant">Medical Research Grant</SelectItem>
              <SelectItem value="Sustainable Energy Fund">Sustainable Energy Fund</SelectItem>
              <SelectItem value="Agricultural Innovation Grant">Agricultural Innovation Grant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Select value={status} onValueChange={(value) => handleFilterChange("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_statuses">All Statuses</SelectItem>
              <SelectItem value="awaiting_result">Awaiting Result</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date.from && !date.to && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  "Date Range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date.from}
                selected={date}
                onSelect={(range) => handleFilterChange("date", range || { from: undefined, to: undefined })}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by company, project, or team member..."
          className="pl-8"
          value={search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="flex items-center gap-1">
              {filter}
              <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter(filter)} />
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs h-7 px-2">
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
