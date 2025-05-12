"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Eye, MoreHorizontal, PenLine } from "lucide-react"
import type { SubmittedProject } from "@/lib/submitted-projects-data"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface SubmittedProjectsTableProps {
  projects: SubmittedProject[]
}

export function SubmittedProjectsTable({ projects }: SubmittedProjectsTableProps) {
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<SubmittedProject | null>(null)
  const [newStatus, setNewStatus] = useState<string>("")
  const [notes, setNotes] = useState<string>("")

  const handleUpdateStatus = (project: SubmittedProject) => {
    setSelectedProject(project)
    setNewStatus(project.status)
    setNotes(project.notes || "")
    setUpdateDialogOpen(true)
  }

  const handleSaveStatus = () => {
    // In a real app, this would call an API to update the status
    console.log("Updating status for project:", selectedProject?.id)
    console.log("New status:", newStatus)
    console.log("Notes:", notes)

    setUpdateDialogOpen(false)
    setSelectedProject(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "awaiting_result":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Awaiting Result
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Funding Project</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead>Submitted By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No submitted projects found.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.companyName}</TableCell>
                  <TableCell>{project.projectName}</TableCell>
                  <TableCell>{format(new Date(project.submissionDate), "MMM d, yyyy")}</TableCell>
                  <TableCell>{project.submittedByName}</TableCell>
                  <TableCell>{getStatusBadge(project.status)}</TableCell>
                  <TableCell>{format(new Date(project.lastUpdated), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(project)}>
                          <PenLine className="mr-2 h-4 w-4" />
                          <span>Update Status</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Project Status</DialogTitle>
            <DialogDescription>
              Update the outcome status for {selectedProject?.projectName} submitted by {selectedProject?.companyName}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="status" className="text-right text-sm font-medium">
                Status
              </label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="awaiting_result">Awaiting Result</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="notes" className="text-right text-sm font-medium">
                Notes
              </label>
              <Textarea
                id="notes"
                className="col-span-3"
                placeholder="Add notes about the status update"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStatus}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
