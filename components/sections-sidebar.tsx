"use client"

import { useState, useEffect, Dispatch, SetStateAction } from "react"
import { CheckCircle2, Circle, FileText, ChevronRight, AlertCircle, Menu, ArrowLeft } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import type { Section } from "@/lib/data"

interface SectionsSidebarProps {
  sections: Section[]
  selectedSection: Section
  onSelectSectionAction: Dispatch<SetStateAction<Section | null>>
}

export default function SectionsSidebar({ sections, selectedSection, onSelectSectionAction }: SectionsSidebarProps) {
  // Calculate completion percentage
  const completedSections = sections.filter((section) => section.status === "completed").length
  const completionPercentage = Math.round((completedSections / sections.length) * 100)

  // State for sidebar collapse
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Load collapsed state from sessionStorage on mount
  useEffect(() => {
    const savedState = sessionStorage.getItem("sectionsSidebarCollapsed")
    if (savedState !== null) {
      setIsCollapsed(savedState === "true")
    }
  }, [])

  // Save collapsed state to sessionStorage when it changes
  useEffect(() => {
    sessionStorage.setItem("sectionsSidebarCollapsed", isCollapsed.toString())
  }, [isCollapsed])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div
      className={`border-r bg-white dark:bg-slate-900 flex flex-col h-full transition-all duration-200 ${isCollapsed ? "w-16" : "w-64"}`}
    >
      <div className="p-4 border-b flex items-center justify-between">
        {!isCollapsed && (
          <>
            <h2 className="font-medium flex items-center">
              <FileText className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
              Application Sections
            </h2>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleSidebar}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Collapse Sidebar</span>
            </Button>
          </>
        )}
        {isCollapsed && (
          <div className="w-full flex justify-center">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleSidebar}>
              <Menu className="h-4 w-4" />
              <span className="sr-only">Expand Sidebar</span>
            </Button>
          </div>
        )}
      </div>

      {!isCollapsed && (
        <div className="px-4 py-2 text-xs text-muted-foreground border-b">
          {completedSections} of {sections.length} sections completed ({completionPercentage}%)
        </div>
      )}

      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-2">
          <TooltipProvider>
            {sections.map((section) => {
              const isSelected = section.id === selectedSection.id
              const isCompleted = section.status === "completed"
              const isDraft = section.status === "draft"
              const isRequired = section.required

              return (
                <Tooltip key={section.id}>
                  <TooltipTrigger asChild>
                    <button
                      className={`w-full text-left px-3 py-2.5 rounded-md mb-1 flex items-center group transition-colors ${
                        isSelected
                          ? "bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-50"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                      onClick={() => onSelectSectionAction(section)}
                    >
                      <div className="mr-2 text-muted-foreground">
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : isDraft ? (
                          <Circle className="h-4 w-4 text-amber-500 dark:text-amber-400 fill-current opacity-30" />
                        ) : (
                          <Circle className="h-4 w-4" />
                        )}
                      </div>

                      {!isCollapsed && (
                        <div className="flex-1">
                          <div
                            className={`text-sm font-medium ${isCompleted ? "text-green-700 dark:text-green-400" : ""}`}
                          >
                            {section.title}
                          </div>

                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <span>{section.wordCount ?? 0} words</span>
                            {isRequired && (
                              <>
                                <span>•</span>
                                <span className="text-red-600 dark:text-red-400">Required</span>
                              </>
                            )}
                            {section.hasWarning && (
                              <AlertCircle className="h-3 w-3 text-amber-500 dark:text-amber-400 ml-1" />
                            )}
                          </div>
                        </div>
                      )}

                      {!isCollapsed && (
                        <ChevronRight
                          className={`h-4 w-4 opacity-0 group-hover:opacity-70 transition-opacity ${
                            isSelected ? "opacity-70" : ""
                          }`}
                        />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side={isCollapsed ? "right" : "bottom"}>
                    <div className="max-w-xs">
                      <div className="font-medium">{section.title}</div>
                      <div className="text-xs mt-1">{section.description}</div>
                      {section.hasWarning && (
                        <div className="text-amber-600 dark:text-amber-400 mt-1 text-xs">
                          Warning: This section needs attention
                        </div>
                      )}
                      <div className="text-xs mt-1">
                        {section.wordCount ?? 0} words • {isRequired ? "Required" : "Optional"}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </TooltipProvider>
        </div>
      </ScrollArea>
    </div>
  )
}
