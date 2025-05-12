"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { companiesData } from "@/lib/companies-data"
import type { TeamMember } from "@/lib/team-roles-data"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

interface AddMemberDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (member: Partial<TeamMember>) => void
  editingMember?: TeamMember
}

export function AddMemberDialog({ isOpen, onClose, onSave, editingMember }: AddMemberDialogProps) {
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(
    editingMember?.assignedCompanies.map((c) => c.id) || [],
  )
  const [formData, setFormData] = useState({
    name: editingMember?.name || "",
    email: editingMember?.email || "",
    role: editingMember?.role || "Team Member",
    message: "",
  })
  const [open, setOpen] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value as "Company Admin" | "Team Member" }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const assignedCompanies = selectedCompanies.map((id) => {
      const company = companiesData.find((c) => c.id === id)
      return {
        id,
        name: company?.name || "",
      }
    })

    onSave({
      ...formData,
      assignedCompanies,
      id: editingMember?.id,
    })
  }

  const toggleCompany = (companyId: string) => {
    setSelectedCompanies((current) =>
      current.includes(companyId) ? current.filter((id) => id !== companyId) : [...current, companyId],
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editingMember ? "Edit Team Member" : "Add New Team Member"}</DialogTitle>
            <DialogDescription>
              {editingMember
                ? "Update the team member's information and role."
                : "Add a new member to your team and assign their role and companies."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Company Admin">Company Admin</SelectItem>
                  <SelectItem value="Team Member">Team Member</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Companies</Label>
              <div className="col-span-3">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                      {selectedCompanies.length > 0
                        ? `${selectedCompanies.length} companies selected`
                        : "Select companies..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Search companies..." />
                      <CommandList>
                        <CommandEmpty>No company found.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                          {companiesData.map((company) => (
                            <CommandItem
                              key={company.id}
                              value={company.name}
                              onSelect={() => toggleCompany(company.id)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedCompanies.includes(company.id) ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {company.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {selectedCompanies.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selectedCompanies.map((id) => {
                      const company = companiesData.find((c) => c.id === id)
                      return company ? (
                        <Badge key={id} variant="outline" className="bg-gray-100 text-gray-800">
                          {company.name}
                        </Badge>
                      ) : null
                    })}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Optional. If unassigned, users can still view eligible companies.
                </p>
              </div>
            </div>

            {!editingMember && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="message" className="text-right">
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Optional message to include in the invitation email"
                  className="col-span-3"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{editingMember ? "Save Changes" : "Add Member"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
