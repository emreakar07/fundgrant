"use client"

import { AddEditProjectForm } from "@/components/funding-projects/add-edit-project-form"

export default function NewFundingProjectPage() {
  return (
    <div className="flex flex-col min-h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <AddEditProjectForm />
    </div>
  )
}
