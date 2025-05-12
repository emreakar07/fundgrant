"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  Form, 
  FormControl, 
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
import { ChevronLeft, Save, Tag } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import type { Analysis, QuestionResponse } from "@/lib/analyses-data"

// Define form validation schema
const formSchema = z.object({
  companyName: z.string().min(1, { message: "Company name is required" }),
  companySector: z.string().min(1, { message: "Sector is required" }),
  projectName: z.string().min(1, { message: "Project name is required" }),
  fundingAmount: z.string()
    .min(1, { message: "Funding amount is required" })
    .refine(val => !isNaN(Number(val)), { message: "Must be a valid number" }),
  status: z.string().min(1, { message: "Status is required" }),
  completedQuestions: z.string()
    .refine(val => !isNaN(Number(val)) && Number(val) >= 0, { message: "Must be a valid number" })
})

export default function EditAnalysisPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [questionAnswers, setQuestionAnswers] = useState<QuestionResponse[]>([])

  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      companySector: "",
      projectName: "",
      fundingAmount: "",
      status: "",
      completedQuestions: ""
    }
  })

  // Fetch analysis data
  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/analyses/${params.id}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch analysis: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        setAnalysis(data)
        
        // Handle the questions array
        if (Array.isArray(data.questions)) {
          setQuestionAnswers(data.questions)
        }
        
        // Set form values from fetched data
        form.reset({
          companyName: data.company?.name || "",
          companySector: data.company?.sector || "",
          projectName: data.project?.name || "",
          fundingAmount: data.project?.fundingAmount?.toString() || "",
          status: data.status || "",
          completedQuestions: data.completedQuestions?.toString() || ""
        })
      } catch (err) {
        console.error('Error fetching analysis:', err)
        setError(err instanceof Error ? err.message : 'Failed to load analysis')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalysis()
  }, [params.id, form])

  // Handle question answer changes
  const handleAnswerChange = (questionId: string, value: string) => {
    setQuestionAnswers(prev => 
      prev.map(q => 
        q.questionId === questionId 
          ? { ...q, answer: value }
          : q
      )
    )
  }

  // Count answered questions
  const countAnsweredQuestions = () => {
    return questionAnswers.filter(q => q.answer && q.answer.trim() !== '').length
  }

  // Submit handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true)
      
      // Update the completedQuestions count based on actual answered questions
      const completedCount = countAnsweredQuestions()
      
      // Format the data for the API
      const analysisData = {
        id: params.id,
        company: {
          name: values.companyName,
          sector: values.companySector,
          logo: analysis?.company?.logo // Preserve existing logo if any
        },
        project: {
          name: values.projectName,
          fundingAmount: Number(values.fundingAmount),
          fundingId: analysis?.project?.fundingId || null
        },
        status: values.status,
        questions: questionAnswers, // Use the updated questions array
        completedQuestions: completedCount, // Use actual count
        // Preserve these fields from original data
        date: analysis?.date,
        createdAt: analysis?.createdAt,
        lastUpdated: new Date().toISOString()
      }
      
      console.log('Updating analysis:', analysisData)
      
      // Call the API to update the analysis
      const response = await fetch(`/api/analyses/${params.id}`, {
        method: 'PUT',
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
      console.log('Analysis updated:', result)
      
      // Show success toast
      toast({
        title: "Analysis updated",
        description: `Successfully updated analysis for ${values.companyName}`,
        duration: 5000
      })
      
      // Redirect to analyses page
      router.push(`/analyses/${params.id}`)
      
    } catch (error) {
      console.error('Error updating analysis:', error)
      
      // Show error toast
      toast({
        title: "Error updating analysis",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
        duration: 5000
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <p className="mt-2 text-sm">
            <Button variant="link" className="p-0 h-auto" onClick={() => router.push('/analyses')}>
              Back to Analyses
            </Button>
          </p>
        </div>
      </div>
    )
  }

  // Calculate progress
  const totalQuestions = questionAnswers.length
  const answeredQuestions = countAnsweredQuestions()
  const progressPercentage = totalQuestions > 0 
    ? Math.round((answeredQuestions / totalQuestions) * 100)
    : 0

  return (
    <div className="container py-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-2"
            asChild
          >
            <Link href={`/analyses/${params.id}`}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Analysis
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Edit Analysis</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            {answeredQuestions} of {totalQuestions} questions answered ({progressPercentage}%)
          </div>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Analysis Details</CardTitle>
          <CardDescription>
            Update the details of this analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Company Section */}
              <div className="space-y-4">
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
              <div className="space-y-4">
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
                        <FormLabel>Funding Amount (€)</FormLabel>
                        <FormControl>
                          <Input placeholder="0" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Status Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Status</h2>
                <Separator />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select 
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Needs Review">Needs Review</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Submit button */}
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="flex items-center gap-2" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-b-0 border-r-0 rounded-full"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Questions Section */}
      {questionAnswers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Questions</CardTitle>
            <CardDescription>
              Update your answers to the analysis questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="space-y-4">
              {questionAnswers.map((question, index) => (
                <AccordionItem key={question.questionId} value={question.questionId}>
                  <AccordionTrigger className="hover:bg-slate-50 dark:hover:bg-slate-800/50 px-4 rounded-lg">
                    <div className="flex items-start gap-2 text-left">
                      <Tag className="h-4 w-4 mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-medium">{index + 1}. {question.question}</span>
                        <p className="text-sm text-muted-foreground mt-1">
                          {question.answer 
                            ? `${question.answer.substring(0, 60)}${question.answer.length > 60 ? '...' : ''}`
                            : 'No answer yet'}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-2">
                      {question.category && (
                        <div className="text-sm text-muted-foreground">
                          Category: {question.category}
                        </div>
                      )}
                      <Textarea
                        placeholder="Enter your answer here..."
                        className="min-h-[150px]"
                        value={question.answer || ''}
                        onChange={(e) => handleAnswerChange(question.questionId, e.target.value)}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={form.handleSubmit(onSubmit)}
                className="flex items-center gap-2" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-b-0 border-r-0 rounded-full"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save All Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 