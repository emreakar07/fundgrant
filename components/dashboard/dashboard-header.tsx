"use client"

import { LayoutDashboard, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function DashboardHeader() {
  return (
    <div className="border-b bg-white dark:bg-slate-900 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold flex items-center">
              <LayoutDashboard className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Overview of your projects, companies, and performance metrics
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9" />
            </div>
            <Button>New Project</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
