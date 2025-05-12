"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

interface TeamRolesHeaderProps {
  onAddMember: () => void
}

export function TeamRolesHeader({ onAddMember }: TeamRolesHeaderProps) {
  return (
    <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Team & Roles</h1>
        <p className="text-muted-foreground">Manage your team members, assign companies, and set access roles</p>
      </div>
      <Button onClick={onAddMember} className="mt-4 md:mt-0">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add New Member
      </Button>
    </div>
  )
}
