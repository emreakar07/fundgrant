import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SubmittedProjectsHeader() {
  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Submitted Projects</h2>
        <p className="text-muted-foreground">Track and manage projects that have been submitted for funding</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          <CalendarIcon className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button size="sm">Bulk Update</Button>
      </div>
    </div>
  )
}
