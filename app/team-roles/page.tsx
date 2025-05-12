"use client"

import { useState } from "react"
import { TeamRolesHeader } from "@/components/team-roles/team-roles-header"
import { TeamMembersTable } from "@/components/team-roles/team-members-table"
import { AddMemberDialog } from "@/components/team-roles/add-member-dialog"
import { RolesPermissionsGuide } from "@/components/team-roles/roles-permissions-guide"
import { teamMembersData, type TeamMember } from "@/lib/team-roles-data"
import { useToast } from "@/components/ui/use-toast"
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

export default function TeamRolesPage() {
  const [members, setMembers] = useState<TeamMember[]>(teamMembersData)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | undefined>(undefined)
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null)
  const { toast } = useToast()

  const handleAddMember = () => {
    setEditingMember(undefined)
    setIsAddDialogOpen(true)
  }

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member)
    setIsAddDialogOpen(true)
  }

  const handleRemoveMember = (memberId: string) => {
    setMemberToRemove(memberId)
    setIsRemoveDialogOpen(true)
  }

  const confirmRemoveMember = () => {
    if (memberToRemove) {
      setMembers(members.filter((member) => member.id !== memberToRemove))

      const memberName = members.find((m) => m.id === memberToRemove)?.name || "Member"

      toast({
        title: "Member removed",
        description: `${memberName} has been removed from the team.`,
      })

      setIsRemoveDialogOpen(false)
      setMemberToRemove(null)
    }
  }

  const handleSaveMember = (memberData: Partial<TeamMember>) => {
    if (editingMember) {
      // Update existing member
      setMembers(
        members.map((member) =>
          member.id === editingMember.id ? { ...member, ...memberData, activeProjects: member.activeProjects } : member,
        ),
      )

      toast({
        title: "Member updated",
        description: `${memberData.name}'s information has been updated.`,
      })
    } else {
      // Add new member
      const newMember: TeamMember = {
        id: `user-${Date.now()}`,
        name: memberData.name || "",
        email: memberData.email || "",
        role: memberData.role || "Team Member",
        assignedCompanies: memberData.assignedCompanies || [],
        activeProjects: 0,
      }

      setMembers([...members, newMember])

      toast({
        title: "Member added",
        description: `${newMember.name} has been added to the team.`,
      })
    }

    setIsAddDialogOpen(false)
    setEditingMember(undefined)
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <TeamRolesHeader onAddMember={handleAddMember} />

      <TeamMembersTable members={members} onEditMember={handleEditMember} onRemoveMember={handleRemoveMember} />

      <RolesPermissionsGuide />

      <AddMemberDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleSaveMember}
        editingMember={editingMember}
      />

      <AlertDialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the team member from your organization and
              revoke their access to all projects.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveMember} className="bg-red-600 hover:bg-red-700">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
