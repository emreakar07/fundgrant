"use client"

import { useState } from "react"
import { ChevronDown, Calendar, Building, FileText, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card } from "@/components/ui/card"
import type { Company, Project } from "@/lib/data"

interface HeaderProps {
  company: Company
  project: Project
  currentStage: "Analysis" | "Writing" | "Submission"
}

export default function Header({ company, project, currentStage }: HeaderProps) {
  const [progress, setProgress] = useState(65)

  // Calculate days remaining until deadline
  const deadline = new Date(project.deadline)
  const today = new Date()
  const daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  const stages = ["Analysis", "Writing", "Submission"]
  const currentStageIndex = stages.indexOf(currentStage)

  return (
    <div className="border-b bg-white dark:bg-slate-900 shadow-sm">
      <div className="container mx-auto px-4 py-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="p-2 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                    <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="p-0 h-auto font-semibold hover:bg-transparent">
                            {company.name} <ChevronDown className="ml-1 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Switch Company</DropdownMenuItem>
                          <DropdownMenuItem>View Company Profile</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <div className="text-xs text-muted-foreground">
                        {company.sector} • {company.size}
                      </div>
                    </div>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">Company Details</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Revenue:</div>
                      <div>€{company.financials.revenue.toLocaleString()}</div>
                      <div>Employees:</div>
                      <div>{company.financials.employees}</div>
                      <div>Founded:</div>
                      <div>{company.financials.yearFounded}</div>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="p-2 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="p-0 h-auto font-semibold hover:bg-transparent">
                            {project.name} <ChevronDown className="ml-1 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Switch Project</DropdownMenuItem>
                          <DropdownMenuItem>View Project Details</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <div className="text-xs text-muted-foreground">
                        {project.sector} • €{project.fundingAmount.toLocaleString()}
                      </div>
                    </div>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">Project Details</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Deadline:</div>
                      <div>{new Date(project.deadline).toLocaleDateString()}</div>
                      <div>Funding Amount:</div>
                      <div>€{project.fundingAmount.toLocaleString()}</div>
                      <div>Required Documents:</div>
                      <div>{project.eligibilityCriteria.length}</div>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-md">
              <Calendar className="h-4 w-4" />
              <div className="text-sm font-medium">
                {daysRemaining <= 0 ? (
                  <span className="text-red-600 dark:text-red-400">Deadline passed</span>
                ) : (
                  <span>{daysRemaining} days remaining</span>
                )}
              </div>
            </div>

            {daysRemaining <= 3 && (
              <div className="flex items-center gap-1 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 px-3 py-1 rounded-md">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Urgent</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-2">
          <div className="flex justify-between text-sm mb-1">
            <div className="flex gap-6">
              {stages.map((stage, index) => (
                <div
                  key={stage}
                  className={`font-medium ${
                    index === currentStageIndex
                      ? "text-blue-600 dark:text-blue-400"
                      : index < currentStageIndex
                        ? "text-green-600 dark:text-green-400"
                        : "text-muted-foreground"
                  }`}
                >
                  {stage}
                </div>
              ))}
            </div>
            <div className="text-muted-foreground">{progress}% complete</div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    </div>
  )
}
