"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Eye, Edit, Trash2, CheckCircle, XCircle, Users } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { FundingProject } from "@/lib/funding-projects-data"

interface FundingProjectsTableProps {
  projects: FundingProject[]
}

export function FundingProjectsTable({ projects }: FundingProjectsTableProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)

  // Calculate days remaining until deadline
  const getDaysRemaining = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Get badge color based on days remaining
  const getDeadlineBadgeVariant = (daysRemaining: number) => {
    if (daysRemaining < 0) return "destructive"
    if (daysRemaining <= 7) return "destructive"
    if (daysRemaining <= 30) return "warning"
    return "outline"
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Handle delete confirmation
  const handleDeleteClick = (projectId: string) => {
    setProjectToDelete(projectId)
    setDeleteDialogOpen(true)
  }

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    // In a real app, you would call an API to delete the project
    console.log("Deleting project:", projectToDelete)
    setDeleteDialogOpen(false)
    setProjectToDelete(null)
    // You would then refresh the projects list
  }

  return (
    <>
      <div className="rounded-md border bg-white dark:bg-slate-900 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Project Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No funding projects found
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => {
                const daysRemaining = getDaysRemaining(project.deadline)
                const isExpired = daysRemaining < 0
                const deadlineBadgeVariant = getDeadlineBadgeVariant(daysRemaining)

                return (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      <div
                        className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={() => router.push(`/funding-projects/${project.id}`)}
                      >
                        {project.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{project.sector}</Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(project.fundingAmount)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{new Date(project.deadline).toLocaleDateString()}</span>
                        <Badge variant={deadlineBadgeVariant} className="mt-1 w-fit">
                          {isExpired
                            ? `Expired ${Math.abs(daysRemaining)} days ago`
                            : `${daysRemaining} days remaining`}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {isExpired ? (
                        <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Expired</span>
                        </Badge>
                      ) : (
                        <Badge
                          variant="success"
                          className="flex items-center gap-1 w-fit bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>Active</span>
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex -space-x-2">
                        <Avatar className="h-7 w-7 border-2 border-background">
                          <AvatarImage src="/abstract-user-icon.png" alt="User" />
                          <AvatarFallback>U1</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-7 w-7 border-2 border-background">
                          <AvatarImage src="/abstract-user-icon.png" alt="User" />
                          <AvatarFallback>U2</AvatarFallback>
                        </Avatar>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => router.push(`/funding-projects/${project.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/funding-projects/${project.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Project
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteClick(project.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Project
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Users className="mr-2 h-4 w-4" />
                            Manage Team
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the funding project and remove it from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
