"use client"

import { useState } from "react"
import {
  FileText,
  HelpCircle,
  FileQuestion,
  BookOpen,
  Search,
  Upload,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  BadgeCheck,
  PiggyBank,
  Scale,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Analysis, Project, ReferenceDocument } from "@/lib/data"
import { Badge } from "@/components/ui/badge"

interface ContextPanelProps {
  activeTab: string
  onChangeTab: (tab: string) => void
  analysisData: Analysis[]
  referenceDocuments: ReferenceDocument[]
  projectDetails?: Project
}

export default function ContextPanel({
  activeTab,
  onChangeTab,
  analysisData,
  referenceDocuments,
  projectDetails,
}: ContextPanelProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCollapsed, setIsCollapsed] = useState(true)

  const filteredAnalysis = searchQuery
    ? analysisData.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : analysisData

  const filteredDocuments = searchQuery
    ? referenceDocuments.filter(
        (doc) =>
          doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : referenceDocuments

  if (isCollapsed) {
    return (
      <div className="border-l bg-white dark:bg-slate-900 flex flex-col h-full">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-full rounded-none border-none"
                onClick={() => setIsCollapsed(false)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Expand Context Panel</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    )
  }

  return (
    <div className="w-80 border-l bg-white dark:bg-slate-900 flex flex-col h-full">
      <Tabs value={activeTab} onValueChange={onChangeTab} className="h-full flex flex-col">
        <div className="border-b p-4 flex items-center justify-between">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="analysis" className="text-xs">
              <FileQuestion className="h-3.5 w-3.5 mr-1.5" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="references" className="text-xs">
              <BookOpen className="h-3.5 w-3.5 mr-1.5" />
              References
            </TabsTrigger>
            <TabsTrigger value="details" className="text-xs">
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              Details
            </TabsTrigger>
          </TabsList>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 ml-2" onClick={() => setIsCollapsed(true)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Collapse Panel</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search context..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="analysis" className="flex-1 m-0">
          <ScrollArea className="h-full overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-sm flex items-center">
                  <FileQuestion className="h-4 w-4 mr-1.5 text-blue-600 dark:text-blue-400" />
                  Analysis Questions
                </h3>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  <HelpCircle className="h-3.5 w-3.5 mr-1.5" />
                  Help
                </Button>
              </div>

              <Accordion type="multiple" defaultValue={["item-0"]} className="space-y-2">
                {filteredAnalysis.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border rounded-md px-3 bg-slate-50 dark:bg-slate-900"
                  >
                    <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm">
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-md border">{item.answer}</div>
                      <div className="flex justify-end mt-2">
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600 dark:text-blue-400">
                          Use in Section
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="references" className="flex-1 m-0">
          <ScrollArea className="h-full overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-sm flex items-center">
                  <BookOpen className="h-4 w-4 mr-1.5 text-blue-600 dark:text-blue-400" />
                  Reference Documents
                </h3>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <Upload className="h-3.5 w-3.5 mr-1.5" />
                  Upload
                </Button>
              </div>

              <div className="space-y-3">
                {filteredDocuments.map((doc, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-sm">{doc.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{doc.description}</p>
                          </div>
                          {doc.isPreviousApplication && (
                            <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-md font-medium">
                              Success
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="border-t flex">
                        <Button variant="ghost" size="sm" className="flex-1 rounded-none text-xs h-9">
                          Preview
                        </Button>
                        <div className="w-px bg-border h-9" />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 rounded-none text-xs h-9 text-blue-600 dark:text-blue-400"
                        >
                          Use
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="details" className="flex-1 m-0">
          <ScrollArea className="h-full overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-sm flex items-center">
                  <FileText className="h-4 w-4 mr-1.5 text-blue-600 dark:text-blue-400" />
                  Project Details
                </h3>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  <HelpCircle className="h-3.5 w-3.5 mr-1.5" />
                  Help
                </Button>
              </div>

              {!projectDetails ? (
                <div className="p-4 border rounded-md text-center bg-slate-50 dark:bg-slate-800">
                  <FileQuestion className="h-10 w-10 mx-auto text-muted-foreground opacity-30 mb-2" />
                  <p className="text-sm text-muted-foreground">No project details available</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">Eligibility Criteria</h4>
                      <div className="space-y-2">
                        {projectDetails.eligibilityCriteria.map((criteria, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 p-2 rounded-md border bg-white dark:bg-slate-800"
                          >
                            <BadgeCheck className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                            <span className="text-sm">{criteria}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">Covered Expenses</h4>
                      <div className="space-y-2">
                        {projectDetails.coveredExpenses.map((expense, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 p-2 rounded-md border bg-white dark:bg-slate-800"
                          >
                            <PiggyBank className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                            <span className="text-sm">{expense}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">Evaluation Criteria</h4>
                      <div className="space-y-2">
                        {projectDetails.evaluationCriteria.map((criteria, index) => (
                          <div
                            key={index}
                            className="flex items-start justify-between p-2 rounded-md border bg-white dark:bg-slate-800"
                          >
                            <div className="flex items-start gap-2">
                              <Scale className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                              <span className="text-sm">{criteria.name}</span>
                            </div>
                            <Badge variant="secondary">{criteria.weight}%</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
