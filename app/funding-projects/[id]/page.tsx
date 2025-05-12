"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import type { FundingProject } from "@/lib/funding-projects-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Euro,
  CheckCircle2,
  Award,
  ClipboardList,
  FileCheck,
  Target,
  Link2,
  ArrowLeft,
  Edit,
  Trash2,
  Copy,
  Calendar,
} from "lucide-react"
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

export default function FundingProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  
  const [project, setProject] = useState<FundingProject | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/funding-projects/${projectId}`)
        
        if (response.status === 404) {
          setProject(null)
          return
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch funding project')
        }
        
        const data = await response.json()
        setProject(data)
      } catch (err) {
        console.error('Error fetching funding project:', err)
        setError('Failed to load project details. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      fetchProject()
    }
  }, [projectId])

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/funding-projects/${projectId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete project')
      }
      
      setDeleteDialogOpen(false)
      router.push("/funding-projects")
    } catch (error) {
      console.error("Error deleting project:", error)
      // You could show an error notification here
    }
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/funding-projects")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Button>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/funding-projects")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <div className="border-b bg-white dark:bg-slate-900 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Button variant="outline" size="sm" onClick={() => router.push("/funding-projects")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
              </Button>
              <h1 className="text-2xl font-semibold mt-2">{project.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">{project.sector}</Badge>
                <span className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Deadline: {new Date(project.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => router.push(`/funding-projects/${projectId}/edit`)}>
                <Edit className="h-4 w-4 mr-1.5" />
                Edit Project
              </Button>
              <Button variant="outline" onClick={() => console.log("Duplicate project")}>
                <Copy className="h-4 w-4 mr-1.5" />
                Duplicate
              </Button>
              <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                <Trash2 className="h-4 w-4 mr-1.5" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 pb-16">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
            <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="match">Match Criteria</TabsTrigger>
            <TabsTrigger value="process">Process</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{project.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Euro className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Funding Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Total Amount</h3>
                    <p className="text-2xl font-bold">{formatCurrency(project.fundingDetails.totalAmount)}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Grant Range</h3>
                    <p>
                      {formatCurrency(project.fundingDetails.minGrant)} -{" "}
                      {formatCurrency(project.fundingDetails.maxGrant)}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Co-Financing Requirement</h3>
                    <p>{project.fundingDetails.coFinancing || "None"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Payment Structure</h3>
                    <p>{project.fundingDetails.paymentStructure || "Not specified"}</p>
                  </div>
                </div>

                {project.coveredExpenses && project.coveredExpenses.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Covered Expenses</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.coveredExpenses.map((expense, index) => (
                        <Badge key={index} variant="secondary">
                          {expense}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Eligibility Tab */}
          <TabsContent value="eligibility" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Eligibility Criteria
                </CardTitle>
              </CardHeader>
              <CardContent>
                {project.eligibilityCriteria && project.eligibilityCriteria.length > 0 ? (
                  <ul className="space-y-2 list-disc pl-5">
                    {project.eligibilityCriteria.map((criteria, index) => (
                      <li key={index}>{criteria}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No eligibility criteria specified.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Evaluation Tab */}
          <TabsContent value="evaluation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Award className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Evaluation Criteria
                </CardTitle>
              </CardHeader>
              <CardContent>
                {project.evaluationCriteria && project.evaluationCriteria.length > 0 ? (
                  <div className="space-y-4">
                    {project.evaluationCriteria.map((criteria, index) => (
                      <div key={index} className="border rounded-md p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{criteria.name}</div>
                          <Badge>{criteria.weight}%</Badge>
                        </div>
                        {criteria.description && (
                          <p className="text-sm text-muted-foreground">{criteria.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No evaluation criteria specified.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FileCheck className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Required Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                {project.requiredDocuments && project.requiredDocuments.length > 0 ? (
                  <div className="space-y-4">
                    {project.requiredDocuments.map((doc, index) => (
                      <div key={index} className="border rounded-md p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium flex items-center">
                            {doc.name}
                            {doc.required && (
                              <Badge
                                variant="outline"
                                className="ml-2 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                              >
                                Required
                              </Badge>
                            )}
                          </div>
                        </div>
                        {doc.description && <p className="text-sm text-muted-foreground">{doc.description}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No required documents specified.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Match Criteria Tab */}
          <TabsContent value="match" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Match Criteria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Target Sectors */}
                <div>
                  <h3 className="font-medium mb-2">Target Sectors</h3>
                  {project.matchCriteria?.targetSectors && project.matchCriteria.targetSectors.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {project.matchCriteria.targetSectors.map((sector, index) => (
                        <Badge key={index} variant="secondary">
                          {sector}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No target sectors specified.</p>
                  )}
                </div>

                {/* Company Size */}
                <div>
                  <h3 className="font-medium mb-2">Company Size</h3>
                  {project.matchCriteria?.companySize && project.matchCriteria.companySize.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {project.matchCriteria.companySize.map((size, index) => (
                        <Badge key={index} variant="outline">
                          {size}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No company size requirements specified.</p>
                  )}
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="font-medium mb-2">Requirements</h3>
                  {project.matchCriteria?.requirements && project.matchCriteria.requirements.length > 0 ? (
                    <ul className="space-y-2 list-disc pl-5">
                      {project.matchCriteria.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No specific requirements.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Process Tab */}
          <TabsContent value="process" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <ClipboardList className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Application Process
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {project.applicationProcess?.steps && project.applicationProcess.steps.length > 0 ? (
                  <div className="space-y-4">
                    {project.applicationProcess.steps.map((step, index) => (
                      <div key={index} className="border rounded-md p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">
                            {index + 1}. {step.name}
                          </div>
                        </div>
                        <p className="text-sm">{step.description}</p>
                        {step.deadline && (
                          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Deadline: {step.deadline}</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No application process steps specified.</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <h3 className="font-medium mb-2">Timeline</h3>
                    <p>{project.applicationProcess?.timeline || "Not specified"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Submission Method</h3>
                    <p>{project.applicationProcess?.submissionMethod || "Not specified"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Link2 className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Important Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                {project.importantLinks && project.importantLinks.length > 0 ? (
                  <div className="space-y-4">
                    {project.importantLinks.map((link, index) => (
                      <div key={index} className="border rounded-md p-4">
                        <div className="flex items-center justify-between mb-1">
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                          >
                            {link.title}
                          </a>
                        </div>
                        <p className="text-sm text-muted-foreground">{link.description}</p>
                        <div className="text-xs text-muted-foreground mt-1 truncate">{link.url}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No important links specified.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the funding project and remove it from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
