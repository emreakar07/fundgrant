"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Send, Download, FileText, Paperclip, AlertCircle, ImageIcon, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

interface PreviewSubmitProps {
  onBackAction: () => void
}

export function PreviewSubmit({ onBackAction }: PreviewSubmitProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Data states
  const [sections, setSections] = useState<any[]>([])
  const [referenceDocuments, setReferenceDocuments] = useState<any[]>([])
  const [company, setCompany] = useState<any | null>(null)
  const [project, setProject] = useState<any | null>(null)
  const [sectionAttachments, setSectionAttachments] = useState<any[]>([])
  const [incompleteRequiredSections, setIncompleteRequiredSections] = useState<string[]>([])
  
  // Fetch all necessary data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch document sections
        const sectionsRes = await fetch('/api/document-sections')
        if (!sectionsRes.ok) {
          throw new Error(`Failed to fetch document sections: ${sectionsRes.status}`)
        }
        const sectionsData = await sectionsRes.json()
        setSections(sectionsData)
        
        // Fetch reference documents (attachments)
        const documentsRes = await fetch('/api/documents')
        if (!documentsRes.ok) {
          throw new Error(`Failed to fetch reference documents: ${documentsRes.status}`)
        }
        const documentsData = await documentsRes.json()
        setReferenceDocuments(documentsData)
        
        // Fetch section attachments
        // For now using mock data since we don't have a dedicated API for section attachments yet
        setSectionAttachments([
          { section: "Executive Summary", files: ["Executive Summary Visual.png"] },
          { section: "Budget & Financial Plan", files: ["Detailed Budget.xlsx", "Financial Projections.pdf"] },
          { section: "Environmental Impact", files: ["Impact Assessment Chart.png"] },
        ])
        
        // Fetch companies (select the first one if available)
        const companiesRes = await fetch('/api/companies')
        if (!companiesRes.ok) {
          throw new Error(`Failed to fetch companies: ${companiesRes.status}`)
        }
        const companiesData = await companiesRes.json()
        if (companiesData.length > 0) {
          setCompany(companiesData[0])
          
          // Fetch projects associated with the company
          const projectsRes = await fetch('/api/funding-projects')
          if (!projectsRes.ok) {
            throw new Error(`Failed to fetch projects: ${projectsRes.status}`)
          }
          const projectsData = await projectsRes.json()
          
          // Find a project related to the selected company
          const companyProject = projectsData.find((p: any) => p.companyId === companiesData[0].id)
          if (companyProject) {
            setProject(companyProject)
          } else if (projectsData.length > 0) {
            setProject(projectsData[0])
          }
        }
        
        // Identify incomplete required sections
        const incompleteSections = sectionsData
          .filter((section: any) => section.isRequired && section.status !== "completed")
          .map((section: any) => section.title)
        
        setIncompleteRequiredSections(incompleteSections)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
        toast({
          title: "Error loading preview data",
          description: err instanceof Error ? err.message : 'Failed to load data',
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [toast])
  
  const handleSendForApproval = () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 2000)
  }

  // Filter only completed and draft sections
  const completedSections = sections.filter(
    (section) => section.status === "completed" || section.status === "draft",
  )
  
  // If still loading, show a loading state
  if (loading) {
    return (
      <div className="w-full py-6 px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Preview & Submit</h1>
            <p className="text-muted-foreground">Loading preview data...</p>
          </div>
          <Button variant="outline" onClick={onBackAction}>
            Back to Editing
          </Button>
        </div>
        
        <div className="flex justify-center items-center h-[600px]">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300">Loading preview data...</p>
          </div>
        </div>
      </div>
    )
  }
  
  // If there was an error fetching data
  if (error) {
    return (
      <div className="w-full py-6 px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Preview & Submit</h1>
            <p className="text-muted-foreground">Error loading preview</p>
          </div>
          <Button variant="outline" onClick={onBackAction}>
            Back to Editing
          </Button>
        </div>
        
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading preview</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="w-full py-6 px-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Preview & Submit</h1>
          <p className="text-muted-foreground">Review your application before submission</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onBackAction}>
            Back to Editing
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export as PDF
          </Button>
          {!isSubmitted ? (
            <Button onClick={handleSendForApproval} disabled={isSubmitting || incompleteRequiredSections.length > 0}>
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send for Approval
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="ghost"
              disabled
              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Sent for Approval
            </Button>
          )}
        </div>
      </div>

      {isSubmitted && (
        <Alert className="mb-6 bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-200 border-green-200 dark:border-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Application sent for approval</AlertTitle>
          <AlertDescription>
            Your application has been sent to the company admin for review. You'll be notified once it's approved.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Application Content
              </CardTitle>
              <CardDescription>Preview of all completed application sections</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="px-6 py-2 divide-y">
                  {completedSections.length > 0 ? 
                    completedSections.map((section) => (
                      <div key={section.id} className="py-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-medium">{section.title}</h3>
                          <Badge variant={section.status === "completed" ? "default" : "outline"}>
                            {section.status === "completed" ? "Completed" : "Draft"}
                          </Badge>
                        </div>

                        <div className="prose dark:prose-invert max-w-none text-sm">
                          <p>{section.content || "No content yet."}</p>
                        </div>

                        {/* Section attachments */}
                        {sectionAttachments.find((a) => a.section === section.title) && (
                          <div className="mt-3 pt-2 border-t">
                            <p className="text-xs font-medium flex items-center mb-2">
                              <Paperclip className="h-3 w-3 mr-1" />
                              Section Attachments
                            </p>
                            <div className="flex flex-col gap-2">
                              {sectionAttachments
                                .find((a) => a.section === section.title)
                                ?.files.map((file: string, i: number) => (
                                  <div 
                                    key={i} 
                                    className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded p-1.5 px-2"
                                  >
                                    <div className="flex items-center">
                                      <div className="h-6 w-6 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center mr-2">
                                        {file.includes(".png") || file.includes(".jpg") || file.includes("Visual") ? (
                                          <ImageIcon className="h-3 w-3" />
                                        ) : file.includes(".xlsx") || file.includes(".csv") ? (
                                          <FileSpreadsheet className="h-3 w-3" />
                                        ) : (
                                          <FileText className="h-3 w-3" />
                                        )}
                                      </div>
                                      <span className="text-xs">{file}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                      <Download className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                    : 
                    <div className="py-4 text-center text-muted-foreground">
                      No completed sections yet.
                    </div>
                  }
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Paperclip className="h-5 w-5 mr-2" />
                Attachments
              </CardTitle>
              <CardDescription>Supporting documents for your application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {referenceDocuments.length > 0 ? 
                  referenceDocuments.map((file, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded p-2">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center mr-3">
                          {(file.type?.includes("image") || file.description?.includes("image")) && <ImageIcon className="h-5 w-5" />}
                          {(file.type?.includes("spreadsheet") || file.type?.includes("excel") || 
                            file.title?.includes(".xlsx") || file.title?.includes(".csv")) && 
                            <FileSpreadsheet className="h-5 w-5" />}
                          {(file.type?.includes("pdf") || file.title?.includes(".pdf")) && <FileText className="h-5 w-5" />}
                          {(!file.type?.includes("image") && !file.type?.includes("spreadsheet") && 
                           !file.type?.includes("excel") && !file.type?.includes("pdf") &&
                           !file.title?.includes(".xlsx") && !file.title?.includes(".pdf") &&
                           !file.title?.includes(".csv") && !file.description?.includes("image")) && 
                            <FileText className="h-5 w-5" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate max-w-[180px]">{file.title || file.name || "Unnamed document"}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span className="truncate">
                              {file.type || "Document"} 
                              {file.isPreviousApplication && " • Previous Application"}
                            </span>
                          </div>
                        </div>
                      </div>
                      {file.createdAt && (
                        <div className="text-xs text-muted-foreground">
                          {new Date(file.createdAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))
                  :
                  <div className="text-center text-muted-foreground py-4">
                    No attachments uploaded yet.
                  </div>
                }
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submission Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Project</p>
                  <p className="text-sm">{project?.name || "Not selected"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Company</p>
                  <p className="text-sm">{company?.name || "Not selected"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Deadline</p>
                  <p className="text-sm">{project?.deadline ? new Date(project.deadline).toLocaleDateString() : "No deadline set"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Funding Amount</p>
                  <p className="text-sm">{project?.fundingAmount ? `€${project.fundingAmount.toLocaleString()}` : "Not specified"}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 dark:bg-slate-800 border-t">
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">Approval Status</p>
                  <Badge
                    variant="outline"
                    className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800"
                  >
                    Pending Approval
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  This application requires approval from the company admin before final submission.
                </p>
              </div>
            </CardFooter>
          </Card>

          {incompleteRequiredSections.length > 0 && (
            <Alert
              variant="destructive"
              className="bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-200"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Missing Required Sections</AlertTitle>
              <AlertDescription className="text-sm">
                <p className="mb-2">The following required sections are incomplete:</p>
                <ul className="list-disc pl-4 space-y-1">
                  {incompleteRequiredSections.map((section, index) => (
                    <li key={index}>{section}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  )
}
