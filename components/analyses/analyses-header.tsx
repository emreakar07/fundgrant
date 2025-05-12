"use client"

import { FileQuestion, Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface AnalysesHeaderProps {
  searchQuery: string
  onSearchChangeAction: (query: string) => void
}

export function AnalysesHeader({ searchQuery, onSearchChangeAction }: AnalysesHeaderProps) {
  return (
    <div className="border-b bg-white dark:bg-slate-900 shadow-sm">
      <div className="w-full px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold flex items-center">
              <FileQuestion className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
              Analyses
            </h1>
            <p className="text-sm text-muted-foreground mt-1">View and manage company-project analyses</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search analyses..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => onSearchChangeAction(e.target.value)}
              />
            </div>
            <Button asChild>
              <Link href="/addAnalysis">
                <Plus className="h-4 w-4 mr-1.5" />
                Start New Analysis
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
