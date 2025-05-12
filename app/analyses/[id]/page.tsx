"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, Edit2, FileText, Calendar, Tag } from "lucide-react"
import type { Analysis, QuestionResponse } from "@/lib/analyses-data"

export default function ViewAnalysisPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)

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
      } catch (err) {
        console.error('Error fetching analysis:', err)
        setError(err instanceof Error ? err.message : 'Failed to load analysis')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalysis()
  }, [params.id])

  // Helper functions
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "Pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      case "Needs Review":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0
    }).format(amount)
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

  // If no analysis data
  if (!analysis) {
    return (
      <div className="p-4">
        <div className="bg-amber-100 border border-amber-400 text-amber-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Analysis not found </strong>
          <span className="block sm:inline">The requested analysis could not be found.</span>
          <p className="mt-2 text-sm">
            <Button variant="link" className="p-0 h-auto" onClick={() => router.push('/analyses')}>
              Back to Analyses
            </Button>
          </p>
        </div>
      </div>
    )
  }

  // Determine if questions is an array or a number
  const questionsArray = Array.isArray(analysis.questions) 
    ? analysis.questions
    : [];

  // Calculate the total questions and completion
  const totalQuestions = Array.isArray(analysis.questions) 
    ? analysis.questions.length 
    : (typeof analysis.questions === 'number' ? analysis.questions : 0);
    
  const completionPercentage = totalQuestions > 0 
    ? Math.round((analysis.completedQuestions / totalQuestions) * 100) 
    : 0;

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
          <h1 className="text-2xl font-bold">Analysis Details</h1>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/analyses/${params.id}/edit`}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Analysis
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    {analysis.company.logo ? (
                      <AvatarImage src={analysis.company.logo} alt={analysis.company.name} />
                    ) : (
                      <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {getInitials(analysis.company.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <CardTitle>{analysis.company.name}</CardTitle>
                    <CardDescription>{analysis.company.sector}</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(analysis.status)}>
                  {analysis.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Project Information</h3>
                <Separator className="mb-4" />
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Project Name</p>
                    <p className="font-medium">{analysis.project.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Funding Amount</p>
                    <p className="font-medium">{formatCurrency(analysis.project.fundingAmount)}</p>
                  </div>
                  {analysis.project.fundingId && (
                    <div>
                      <p className="text-sm text-muted-foreground">Funding ID</p>
                      <p className="font-medium">{analysis.project.fundingId}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Progress</h3>
                <Separator className="mb-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completion</span>
                    <span>{completionPercentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {analysis.completedQuestions} of {totalQuestions} questions answered
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Dates</h3>
                <Separator className="mb-4" />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Started</p>
                      <p className="font-medium">{formatDate(analysis.date)}</p>
                    </div>
                  </div>
                  
                  {analysis.completionDate && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Completed</p>
                        <p className="font-medium">{formatDate(analysis.completionDate)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Questions Card */}
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Analysis Questions</CardTitle>
              <CardDescription>
                {completionPercentage === 100 ? "All questions answered" : "Questions to be analyzed"}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {questionsArray.length > 0 ? (
                  questionsArray.map((q, index) => (
                    <div key={q.questionId || index} className="border-b pb-3 last:border-0">
                      <div className="flex items-start gap-1 mb-1">
                        <Tag className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                        <p className="font-medium text-sm">{q.question}</p>
                      </div>
                      <p className="text-sm ml-5 text-muted-foreground">
                        {q.answer ? q.answer.substring(0, 60) + (q.answer.length > 60 ? "..." : "") : "Not answered yet"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No detailed questions available.</p>
                )}
              </div>
            </CardContent>
            
            <CardFooter>
              <p className="text-sm text-muted-foreground w-full text-center">
                {analysis.completedQuestions} of {totalQuestions} questions completed
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
} 