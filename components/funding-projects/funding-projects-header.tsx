"use client"

import { FileText, Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

interface FundingProjectsHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function FundingProjectsHeader({ searchQuery, onSearchChange }: FundingProjectsHeaderProps) {
  const router = useRouter()

  return (
    <div className="border-b bg-white dark:bg-slate-900 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold flex items-center">
              <FileText className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
              Funding Projects
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Browse and manage available funding opportunities</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            <Button onClick={() => router.push("/funding-projects/new")}>
              <Plus className="h-4 w-4 mr-1.5" />
              Add New Project
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
