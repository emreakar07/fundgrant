"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { ChevronLeft, Save, Loader2, Plus, Check, RefreshCw, ChevronDown } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

// Define types for questions
interface AnalysisQuestion {
  id: string
  text: string
  question?: string
  answer?: string
  category: string
  isRequired: boolean
}

// Define available funding projects
const FUNDING_PROJECTS = [
  { id: "eu-green-innovation", name: "EU Green Innovation Fund" },
  { id: "horizon-europe", name: "Horizon Europe" },
  { id: "eic-accelerator", name: "EIC Accelerator" },
  { id: "digital-europe", name: "Digital Europe Programme" }
]

// Define form validation schema
const formSchema = z.object({
  companyName: z.string().min(1, { message: "Company name is required" }),
  companySector: z.string().min(1, { message: "Sector is required" }),
  projectName: z.string().min(1, { message: "Project name is required" }),
  fundingProject: z.string().min(1, { message: "Funding project is required" }),
  fundingAmount: z.string()
    .min(1, { message: "Funding amount is required" })
    .refine(val => !isNaN(Number(val)), { message: "Must be a valid number" }),
  status: z.string().min(1, { message: "Status is required" })
})

export default function AddAnalysisPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [questions, setQuestions] = useState<AnalysisQuestion[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const questionsRef = useRef<HTMLDivElement>(null)
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({})

  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      companySector: "",
      projectName: "",
      fundingProject: "",
      fundingAmount: "",
      status: "Pending"
    }
  })

  // Handle funding project change - load questions for selected project
  const handleProjectChange = async (projectId: string) => {
    if (!projectId) return
    
    try {
      setLoadingQuestions(true)
      console.log(`Loading questions for project: ${projectId}`)
      
      // Update form value
      form.setValue("fundingProject", projectId)
      
      // Get the project name from the selected project
      const selectedProject = FUNDING_PROJECTS.find(p => p.id === projectId)
      const projectName = selectedProject?.name || ""
      
      console.log(`Looking for questions for: ${projectName} (${projectId})`)
      
      // Fetch questions for this project - checking both by ID and name
      const response = await fetch(`/api/analysis-questions/by-project?projectId=${encodeURIComponent(projectId)}&projectName=${encodeURIComponent(projectName)}`)
      
      if (!response.ok) {
        throw new Error(`Failed to load questions: ${response.status}`)
      }
      
      const data = await response.json()
      console.log(`Loaded ${data.length} questions for project ${projectId}`)
      
      setQuestions(data)
      
      // Initialize answers object with empty strings
      const initialAnswers: Record<string, string> = {}
      data.forEach((q: AnalysisQuestion) => {
        initialAnswers[q.id] = ""
      })
      setAnswers(initialAnswers)
      
      // Scroll to questions section after loading
      setTimeout(() => {
        if (data.length > 0 && questionsRef.current) {
          questionsRef.current.scrollIntoView({ behavior: 'smooth' })
        }
      }, 500)
    } catch (error) {
      console.error("Error loading questions:", error)
      toast({
        title: "Error loading questions",
        description: error instanceof Error ? error.message : "Failed to load questions",
        variant: "destructive"
      })
    } finally {
      setLoadingQuestions(false)
    }
  }

  // Handle answer change
  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  // Toggle question expansion
  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }))
  }

  // Calculate completion progress
  const getCompletionProgress = () => {
    if (!questions.length) return 0
    
    const answeredCount = Object.values(answers).filter(a => a.trim().length > 0).length
    return Math.round((answeredCount / questions.length) * 100)
  }

  // Submit handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true)
      
      // Validate that required questions are answered
      const requiredQuestions = questions.filter(q => q.isRequired)
      const unansweredRequired = requiredQuestions.filter(q => !answers[q.id] || answers[q.id].trim() === "")
      
      if (unansweredRequired.length > 0) {
        toast({
          title: "Required questions not answered",
          description: `Please answer all required questions before submitting`,
          variant: "destructive",
        })
        
        // Scroll to questions section
        if (questionsRef.current) {
          questionsRef.current.scrollIntoView({ behavior: 'smooth' })
        }
        
        return
      }
      
      // Format the data for the API
      const answeredQuestions = Object.entries(answers)
        .filter(([_, answer]) => answer.trim().length > 0)
        .map(([id, answer]) => {
          const questionObj = questions.find(q => q.id === id)
          return {
            questionId: id,
            question: questionObj?.text || questionObj?.question || "",
            answer: answer,
            category: questionObj?.category || "General"
          }
        })
      
      const analysisData = {
        company: {
          name: values.companyName,
          sector: values.companySector
        },
        project: {
          name: values.projectName,
          fundingId: values.fundingProject,
          fundingAmount: Number(values.fundingAmount)
        },
        date: new Date().toISOString(),
        status: values.status,
        questions: questions.length,
        completedQuestions: answeredQuestions.length,
        answers: answeredQuestions
      }
      
      console.log('Submitting analysis:', analysisData)
      
      // Call the API to create the analysis
      const response = await fetch('/api/analyses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(analysisData)
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Error: ${response.status} ${response.statusText}`)
      }
      
      const result = await response.json()
      console.log('Analysis created:', result)
      
      // Show success toast
      toast({
        title: "Analysis created",
        description: `Successfully created analysis for ${values.companyName}`,
        duration: 5000
      })
      
      // Redirect to analyses page
      router.push('/analyses')
      
    } catch (error) {
      console.error('Error creating analysis:', error)
      
      // Show error toast
      toast({
        title: "Error creating analysis",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
        duration: 5000
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-2"
            asChild
          >
            <Link href="/analyses">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Add New Analysis</h1>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Project Details Section */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Enter company and project information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Company Section */}
              <div className="space-y-4 mb-8">
                <h2 className="text-lg font-semibold">Company Information</h2>
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="companySector"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sector</FormLabel>
                        <FormControl>
                          <Input placeholder="Company sector" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Project Section */}
              <div className="space-y-4 mb-8">
                <h2 className="text-lg font-semibold">Project Information</h2>
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="projectName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Project name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="fundingAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Funding Amount</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Funding Programme */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Funding Programme</h2>
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fundingProject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Funding Project</FormLabel>
                        <Select
                          onValueChange={handleProjectChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select funding project" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {FUNDING_PROJECTS.map(project => (
                              <SelectItem key={project.id} value={project.id}>
                                {project.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the funding project to load relevant analysis questions
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Needs Review">Needs Review</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Analysis Questions Section */}
          <div ref={questionsRef}>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Analysis Questions</CardTitle>
                    <CardDescription>
                      Answer the questions relevant to your funding application
                    </CardDescription>
                  </div>
                  {questions.length > 0 && (
                    <div className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-sm font-medium">
                      {getCompletionProgress()}% Complete
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {loadingQuestions ? (
                  <div className="text-center py-12">
                    <Loader2 className="h-10 w-10 mx-auto mb-4 animate-spin text-primary" />
                    <p className="text-lg text-muted-foreground">Loading questions...</p>
                  </div>
                ) : questions.length > 0 ? (
                  <div className="space-y-4">
                    {questions.map((question, index) => {
                      const questionText = question.text || question.question || "Question not available";
                      return (
                        <div key={question.id} className="border rounded-lg overflow-hidden">
                          <div 
                            className="p-4 flex items-start cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                            onClick={() => toggleQuestion(question.id)}
                          >
                            <div className="flex-1">
                              <div className="flex items-baseline mb-1">
                                <span className="text-sm font-medium mr-2">{index + 1}.</span>
                                <span className="font-medium">{questionText}</span>
                                {question.isRequired && <span className="text-red-500 ml-1">*</span>}
                              </div>
                              <div className="text-sm text-muted-foreground ml-6">
                                {expandedQuestions[question.id] ? 'Click to collapse' : 'Click to expand'}
                              </div>
                            </div>
                            <div className="ml-4 flex items-center">
                              {answers[question.id]?.trim() && (
                                <Check className="h-4 w-4 text-green-500 mr-2" />
                              )}
                              <ChevronDown 
                                className={`h-5 w-5 transition-transform ${expandedQuestions[question.id] ? 'rotate-180' : ''}`} 
                              />
                            </div>
                          </div>
                          
                          {expandedQuestions[question.id] && (
                            <div className="p-4 border-t">
                              <div className="text-sm text-muted-foreground mb-2">
                                {question.isRequired ? "Required question" : "Optional question"}
                              </div>
                              <Textarea
                                value={answers[question.id] || ""}
                                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                placeholder="Enter your answer here..."
                                className="min-h-[120px] w-full"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed rounded-md">
                    <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                      <RefreshCw className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Questions Loaded</h3>
                    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                      Please select a funding project above to load relevant analysis questions
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              type="button"
              onClick={() => router.push('/analyses')}
            >
              Cancel
            </Button>
            
            <Button 
              type="submit"
              disabled={isSubmitting || !form.formState.isValid || 
                (questions.length > 0 && getCompletionProgress() === 0)}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving Analysis...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Analysis
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
} 