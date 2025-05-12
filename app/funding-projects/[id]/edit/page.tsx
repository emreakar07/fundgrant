"use client"

import { useParams } from "next/navigation"
import { AddEditProjectForm } from "@/components/funding-projects/add-edit-project-form"
import { fundingProjectsData } from "@/lib/funding-projects-data"

export default function EditFundingProjectPage() {
  const params = useParams()
  const projectId = params.id as string

  // Find the project by ID
  const project = fundingProjectsData.find((p) => p.id === projectId)

  return (
    <div className="flex flex-col min-h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <AddEditProjectForm project={project} isEditing={true} />
    </div>
  )
}
