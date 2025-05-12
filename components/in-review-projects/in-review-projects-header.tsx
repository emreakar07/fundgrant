import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function InReviewProjectsHeader() {
  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">In Review Projects</h2>
        <p className="text-muted-foreground">
          Projects that have been completed and are awaiting review by Company Admin
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          <CalendarIcon className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button size="sm">Assign Reviewer</Button>
      </div>
    </div>
  )
}
