"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit2, Trash2 } from "lucide-react"
import type { TeamMember } from "@/lib/team-roles-data"

interface TeamMembersTableProps {
  members: TeamMember[]
  onEditMember: (member: TeamMember) => void
  onRemoveMember: (memberId: string) => void
}

export function TeamMembersTable({ members, onEditMember, onRemoveMember }: TeamMembersTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  const getRoleBadgeColor = (role: string) => {
    return role === "Company Admin"
      ? "bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-900 dark:text-blue-300"
      : "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900 dark:text-green-300"
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="hidden sm:table-cell">Role</TableHead>
            <TableHead className="hidden lg:table-cell">Assigned Companies</TableHead>
            <TableHead className="hidden sm:table-cell text-center">Active Projects</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id} className="cursor-pointer" onClick={() => toggleRow(member.id)}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    {member.avatar && <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />}
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div>{member.name}</div>
                    <div className="text-sm text-muted-foreground md:hidden">{member.email}</div>
                    <div className="text-xs text-muted-foreground sm:hidden">
                      <Badge variant="outline" className={getRoleBadgeColor(member.role)}>
                        {member.role}
                      </Badge>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">{member.email}</TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge variant="outline" className={getRoleBadgeColor(member.role)}>
                  {member.role}
                </Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {member.assignedCompanies.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {member.assignedCompanies.slice(0, 2).map((company) => (
                      <Badge key={company.id} variant="outline" className="bg-gray-100 text-gray-800">
                        {company.name}
                      </Badge>
                    ))}
                    {member.assignedCompanies.length > 2 && (
                      <Badge variant="outline" className="bg-gray-100 text-gray-800">
                        +{member.assignedCompanies.length - 2} more
                      </Badge>
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">No companies assigned</span>
                )}
              </TableCell>
              <TableCell className="hidden sm:table-cell text-center">
                <Badge variant="outline" className="bg-gray-100 text-gray-800">
                  {member.activeProjects}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditMember(member)
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveMember(member.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
