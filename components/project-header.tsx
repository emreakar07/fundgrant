"use client"

import { useState, useEffect } from "react"
import { Lock, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import type { Company, Project as BaseProject } from "@/lib/data"

// Extend the Project type to include editedBy
interface Project extends BaseProject {
  editedBy?: string | null;
  companyId?: string;
}

// Fallback mock data for projects
const mockProjects = [
  {
    id: "proj-1",
    name: "EU Green Innovation Fund",
    sector: "Sustainability",
    fundingAmount: 750000,
    deadline: "2025-06-15",
    companyId: "comp-1",
    editedBy: null,
    eligibilityCriteria: [],
    coveredExpenses: [],
    evaluationCriteria: []
  },
  {
    id: "proj-2",
    name: "Horizon Europe Health Initiative",
    sector: "Healthcare",
    fundingAmount: 950000,
    deadline: "2025-07-30",
    companyId: "comp-2",
    editedBy: "Jane Smith",
    eligibilityCriteria: [],
    coveredExpenses: [],
    evaluationCriteria: []
  },
  {
    id: "proj-3",
    name: "Regional Clean Energy Grant",
    sector: "Energy",
    fundingAmount: 350000,
    deadline: "2025-05-10",
    companyId: "comp-1",
    editedBy: "Michael Brown",
    eligibilityCriteria: [],
    coveredExpenses: [],
    evaluationCriteria: []
  },
  {
    id: "proj-4",
    name: "Digital Health Innovation Program",
    sector: "Healthcare",
    fundingAmount: 550000,
    deadline: "2025-08-22",
    companyId: "comp-2",
    editedBy: null,
    eligibilityCriteria: [],
    coveredExpenses: [],
    evaluationCriteria: []
  },
  {
    id: "proj-5",
    name: "Sustainable Agriculture Fund",
    sector: "Agriculture",
    fundingAmount: 420000,
    deadline: "2025-09-15",
    companyId: "comp-3",
    editedBy: null,
    eligibilityCriteria: [],
    coveredExpenses: [],
    evaluationCriteria: []
  },
] as Project[]

interface ProjectHeaderProps {
  companies?: Company[]
  initialCompany?: Company
  initialProject?: Project
  progress?: number
  onCompanyChange?: (company: Company) => void
  onProjectChange?: (project: Project) => void
}

export default function ProjectHeader({
  companies = [],
  initialCompany,
  initialProject,
  progress = 65,
  onCompanyChange,
  onProjectChange,
}: ProjectHeaderProps) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(initialCompany?.id || "")
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProject?.id || "")
  const [availableProjects, setAvailableProjects] = useState<Project[]>([])

  // Use provided companies or fallback to empty array
  const companiesList = companies.length > 0 ? companies : []

  // Calculate days remaining until deadline
  const selectedProject: Project | undefined = initialProject || mockProjects.find((p) => p.id === selectedProjectId)
  const deadline = selectedProject?.deadline ? new Date(selectedProject.deadline) : new Date()
  const today = new Date()
  const daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  // Set current user as the editor of the selected project
  const currentUser = "John Doe" // This would come from authentication in a real app

  useEffect(() => {
    // Initialize company if provided
    if (initialCompany && !selectedCompanyId) {
      setSelectedCompanyId(initialCompany.id)
    } else if (companies.length > 0 && !selectedCompanyId) {
      // Auto-select first company if none selected
      setSelectedCompanyId(companies[0].id)
    }
    
    // Initialize project if provided
    if (initialProject && !selectedProjectId) {
      setSelectedProjectId(initialProject.id)
    }
    
    // For now, continue using mock projects data since we don't have real project data
    const companyProjects = mockProjects.filter((project) => project.companyId === selectedCompanyId)
    setAvailableProjects(companyProjects.length > 0 ? companyProjects : mockProjects)
  }, [companies, initialCompany, initialProject, selectedCompanyId, selectedProjectId])

  // Handle company selection change
  const handleCompanyChange = (companyId: string) => {
    setSelectedCompanyId(companyId)
    const selectedCompany = companiesList.find((c) => c.id === companyId)
    if (onCompanyChange && selectedCompany) {
      onCompanyChange(selectedCompany)
    }
  }

  // Handle project selection change
  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId)
    const selectedProject = mockProjects.find((p) => p.id === projectId)
    if (onProjectChange && selectedProject) {
      onProjectChange(selectedProject)
    }
  }

  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b shadow-sm">
      <div className="px-6 py-4">
        <div className="flex flex-col space-y-4">
          {/* Company and Project Selection */}
          <div className="flex items-center gap-4">
            <div className="w-64">
              <Select value={selectedCompanyId} onValueChange={handleCompanyChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Companies</SelectLabel>
                    {companiesList.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1 ml-1">
                {companiesList.find((c) => c.id === selectedCompanyId)?.sector} •
                {companiesList.find((c) => c.id === selectedCompanyId)?.financials?.employees} employees
              </p>
            </div>

            <div className="w-64">
              <Select value={selectedProjectId} onValueChange={handleProjectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Projects</SelectLabel>
                    {availableProjects.map((project) => (
                      <SelectItem
                        key={project.id}
                        value={project.id}
                        disabled={!!(project.editedBy && project.editedBy !== currentUser)}
                      >
                        <div className="flex items-center">
                          {project.name}
                          {project.editedBy && project.editedBy !== currentUser && (
                            <Lock className="h-3 w-3 ml-2 text-muted-foreground" />
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div className="flex items-center justify-between mt-1 ml-1">
                <p className="text-xs text-muted-foreground">
                  {selectedProject?.sector} • €{selectedProject?.fundingAmount?.toLocaleString() || 'N/A'}
                </p>

                {selectedProject?.editedBy && selectedProject.editedBy !== currentUser && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1 text-amber-600 border-amber-200 bg-amber-50"
                        >
                          <Lock className="h-3 w-3" />
                          <span className="text-xs">Locked</span>
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Currently being edited by {selectedProject.editedBy}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-md">
                <span className="text-sm font-medium">
                  {daysRemaining <= 0 ? (
                    <span key="deadline-passed" className="text-red-600 dark:text-red-400">Deadline passed</span>
                  ) : (
                    <span key="days-remaining">{daysRemaining} days remaining</span>
                  )}
                </span>
              </div>

              {daysRemaining <= 3 && (
                <div className="flex items-center gap-1 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 px-3 py-1 rounded-md">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Urgent</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">{progress}% complete</div>
            <div className="flex-1">
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
