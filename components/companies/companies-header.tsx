"use client"

import { Building2, Search, Plus, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface CompaniesHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  sectorFilter: string | null
  onSectorFilterChange: (sector: string | null) => void
  industryFilter: string | null
  onIndustryFilterChange: (industry: string | null) => void
  sizeFilter: string | null
  onSizeFilterChange: (size: string | null) => void
  sectors: string[]
  industries: string[]
  sizes: string[]
  onAddCompany: () => void
}

export function CompaniesHeader({
  searchQuery,
  onSearchChange,
  sectorFilter,
  onSectorFilterChange,
  industryFilter,
  onIndustryFilterChange,
  sizeFilter,
  onSizeFilterChange,
  sectors,
  industries,
  sizes,
  onAddCompany,
}: CompaniesHeaderProps) {
  const clearFilters = () => {
    onSectorFilterChange(null)
    onIndustryFilterChange(null)
    onSizeFilterChange(null)
  }

  const hasActiveFilters = sectorFilter !== null || industryFilter !== null || sizeFilter !== null

  return (
    <div className="border-b bg-white dark:bg-slate-900 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold flex items-center">
              <Building2 className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
              Companies
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your client companies</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Filter className="h-4 w-4" />
                  {hasActiveFilters && <span className="absolute -top-1 -right-1 h-2 w-2 bg-blue-600 rounded-full" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter Companies</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuLabel className="text-xs">By Sector</DropdownMenuLabel>
                {sectors.map((sector) => (
                  <DropdownMenuItem
                    key={sector}
                    className="flex items-center justify-between"
                    onClick={() => onSectorFilterChange(sectorFilter === sector ? null : sector)}
                  >
                    <span>{sector}</span>
                    {sectorFilter === sector && <Badge variant="secondary">Selected</Badge>}
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />

                <DropdownMenuLabel className="text-xs">By Industry</DropdownMenuLabel>
                {industries.map((industry) => (
                  <DropdownMenuItem
                    key={industry}
                    className="flex items-center justify-between"
                    onClick={() => onIndustryFilterChange(industryFilter === industry ? null : industry)}
                  >
                    <span>{industry}</span>
                    {industryFilter === industry && <Badge variant="secondary">Selected</Badge>}
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />

                <DropdownMenuLabel className="text-xs">By Size</DropdownMenuLabel>
                {sizes.map((size) => (
                  <DropdownMenuItem
                    key={size}
                    className="flex items-center justify-between"
                    onClick={() => onSizeFilterChange(sizeFilter === size ? null : size)}
                  >
                    <span>{size}</span>
                    {sizeFilter === size && <Badge variant="secondary">Selected</Badge>}
                  </DropdownMenuItem>
                ))}

                {hasActiveFilters && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={clearFilters} className="text-red-500 dark:text-red-400">
                      Clear all filters
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button onClick={onAddCompany}>
              <Plus className="h-4 w-4 mr-1.5" />
              Add Company
            </Button>
          </div>
        </div>

        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mt-3 flex-wrap">
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
            {industryFilter && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Industry: {industryFilter}
                <button
                  className="ml-1 hover:text-foreground"
                  onClick={() => onIndustryFilterChange(null)}
                  aria-label="Remove industry filter"
                >
                  ×
                </button>
              </Badge>
            )}
            {sizeFilter && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Size: {sizeFilter}
                <button
                  className="ml-1 hover:text-foreground"
                  onClick={() => onSizeFilterChange(null)}
                  aria-label="Remove size filter"
                >
                  ×
                </button>
              </Badge>
            )}
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={clearFilters}>
                Clear all
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
