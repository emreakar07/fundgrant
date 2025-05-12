"use client"

import { useState, useEffect } from "react"
import ProjectHeader from "@/components/project-header"
import AgentSelector from "@/components/agent-selector"
import SectionsSidebar from "@/components/sections-sidebar"
import WritingCanvasWithLLM from "@/components/writing-canvas-with-llm"
import ContextPanel from "@/components/context-panel"
import { ProjectAttachments } from "@/components/project-attachments"
import { PreviewSubmit } from "@/components/preview-submit"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Paperclip, Eye } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { mockData } from "@/lib/data"
import type { Company, Project, Analysis, Section, Agent, ReferenceDocument } from "@/lib/data"

export default function ProjectWritingWorkspace() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  // Data state
  const [companies, setCompanies] = useState<Company[]>([])
  const [analyses, setAnalyses] = useState<any[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [referenceDocuments, setReferenceDocuments] = useState<ReferenceDocument[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [analysisQuestions, setAnalysisQuestions] = useState<any[]>([])

  // UI state
  const [selectedSection, setSelectedSection] = useState<Section | null>(null)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [contextTab, setContextTab] = useState("analysis")
  const [isComparing, setIsComparing] = useState(false)
  const [personalTouchMode, setPersonalTouchMode] = useState(false)
  const [activeTab, setActiveTab] = useState<"writing" | "attachments" | "preview">("writing")
  const [progress, setProgress] = useState(65)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [analysisData, setAnalysisData] = useState<any[]>([])

  // Fetch data from MongoDB
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch companies
        console.log('Fetching companies from API...')
        const companiesRes = await fetch('/api/companies')
        if (!companiesRes.ok) {
          throw new Error(`Failed to fetch companies: ${companiesRes.status}`)
        }
        const companiesData = await companiesRes.json()
        console.log(`Received ${companiesData.length} companies`)
        setCompanies(companiesData)
        
        // Set default selected company if available
        if (companiesData.length > 0) {
          setSelectedCompany(companiesData[0])
        }
        
        // Fetch funding projects
        console.log('Fetching funding projects from API...')
        const projectsRes = await fetch('/api/funding-projects')
        if (!projectsRes.ok) {
          console.warn(`Could not fetch funding projects: ${projectsRes.status}`)
        } else {
          const projectsData = await projectsRes.json()
          console.log(`Received ${projectsData.length} funding projects`)
          setProjects(projectsData)
        }
        
        // Fetch analyses
        console.log('Fetching analyses from API...')
        const analysesRes = await fetch('/api/analyses')
        if (!analysesRes.ok) {
          console.warn(`Could not fetch analyses: ${analysesRes.status}`)
        } else {
          const analysesData = await analysesRes.json()
          console.log(`Received ${analysesData.length} analyses`)
          setAnalyses(analysesData)
        }
        
        // Fetch analysis questions
        console.log('Fetching analysis questions from API...')
        const questionsRes = await fetch('/api/analysis-questions')
        if (!questionsRes.ok) {
          console.warn(`Could not fetch analysis questions: ${questionsRes.status}`)
        } else {
          const questionsData = await questionsRes.json()
          console.log(`Received ${questionsData.length} analysis questions`)
          setAnalysisQuestions(questionsData)
        }
        
        // Fetch document sections
        console.log('Fetching document sections from API...')
        const sectionsRes = await fetch('/api/document-sections')
        if (!sectionsRes.ok) {
          console.warn(`Could not fetch document sections: ${sectionsRes.status}`)
        } else {
          const sectionsData = await sectionsRes.json()
          console.log(`Received ${sectionsData.length} document sections`)
          
          // Convert document sections to the format expected by the UI
          const formattedSections = sectionsData.map((section: any) => ({
            id: section.id,
            title: section.title,
            description: section.description || "",
            content: section.content || "",
            wordCount: section.wordCount || 0,
            status: section.status || "not_started",
            required: section.isRequired || false,
            hasWarning: section.hasWarning || false,
          }))
          
          setSections(formattedSections)
        }
        
        // Fetch reference documents
        console.log('Fetching reference documents from API...')
        const docsRes = await fetch('/api/documents')
        if (!docsRes.ok) {
          console.warn(`Could not fetch reference documents: ${docsRes.status}`)
        } else {
          const docsData = await docsRes.json()
          console.log(`Received ${docsData.length} reference documents`)
          setReferenceDocuments(docsData)
        }
        
        // Fetch agents
        console.log('Fetching agents from API...')
        const agentsRes = await fetch('/api/agents')
        if (!agentsRes.ok) {
          console.warn(`Could not fetch agents: ${agentsRes.status}`)
        } else {
          const agentsData = await agentsRes.json()
          console.log(`Received ${agentsData.length} agents`)
          setAgents(agentsData)
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
        toast({
          title: "Error loading data",
          description: err instanceof Error ? err.message : 'Failed to load data',
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [toast])
  
  // Set default selected section when sections change
  useEffect(() => {
    if (sections.length > 0 && !selectedSection) {
      setSelectedSection(sections[0])
    }
  }, [sections, selectedSection])
  
  // Handle section update from WritingCanvasWithLLM
  const handleSectionUpdate = (updatedSection: Section) => {
    // Update the sections state with the updated section
    setSections(prevSections => 
      prevSections.map(section => 
        section.id === updatedSection.id ? updatedSection : section
      )
    );
    
    // Also update the selected section if it's the one being updated
    if (selectedSection && selectedSection.id === updatedSection.id) {
      setSelectedSection(updatedSection);
    }
  };
  
  // Set default selected agent when agents change
  useEffect(() => {
    if (agents.length > 0 && !selectedAgent) {
      // Find the recommended agent or use the first one
      const recommendedAgent = agents.find(agent => agent.isRecommended) || agents[0]
      setSelectedAgent(recommendedAgent)
    }
  }, [agents, selectedAgent])
  
  // Set default selected project when projects change 
  useEffect(() => {
    if (projects.length > 0 && selectedCompany && !selectedProject) {
      // Find a project associated with the selected company
      const companyProject = projects.find(project => project.companyId === selectedCompany.id)
      if (companyProject) {
        setSelectedProject(companyProject)
        
        // Set project ID in URL
        if (typeof window !== 'undefined') {
          const url = new URL(window.location.href);
          url.searchParams.set('projectId', companyProject.id);
          window.history.pushState({}, '', url.toString());
        }
      }
    }
  }, [projects, selectedCompany, selectedProject])
  
  // Update analysis data when selected company and project changes
  useEffect(() => {
    const fetchAnalysisQuestions = async () => {
      if (selectedCompany && selectedProject) {
        try {
          // Fetch analysis questions for the specific company and project
          const url = `/api/analysis-questions/by-project?companyId=${selectedCompany.id}&projectId=${selectedProject.id}`
          const response = await fetch(url)
          
          if (response.ok) {
            const data = await response.json()
            console.log(`Received ${data.length} analysis questions for selected company/project`)
            
            if (data.length > 0) {
              // Format questions for UI
              const formattedQuestions = data.map((item: any) => ({
                question: item.question,
                answer: item.answer || ""
              }))
              setAnalysisData(formattedQuestions)
              return
            }
          } else {
            console.warn(`Failed to fetch analysis questions: ${response.status}`)
          }
        } catch (error) {
          console.error('Error fetching analysis questions:', error)
        }
        
        // If no specific questions found or error occurred, use all available questions
        if (analysisQuestions.length > 0) {
          const formattedQuestions = analysisQuestions.map((item: any) => ({
            question: item.question,
            answer: item.answer || ""
          }))
          setAnalysisData(formattedQuestions)
        } else {
          setAnalysisData([])
        }
      }
    }
    
    fetchAnalysisQuestions()
  }, [selectedCompany, selectedProject, analysisQuestions])

  const handleCompanyChange = (company: Company) => {
    setSelectedCompany(company)
    
    // Find projects associated with this company
    const companyProject = projects.find(p => p.companyId === company.id)
    
    if (companyProject) {
      setSelectedProject(companyProject)
      
      // Update URL with project ID (without reloading page)
      const url = new URL(window.location.href);
      url.searchParams.set('projectId', companyProject.id);
      window.history.pushState({}, '', url.toString());
      
      // Look for analyses associated with this company/project for progress
      const analysis = analyses.find(a => 
        a.companyId === company.id && a.projectId === companyProject.id
      )
      
      if (analysis && analysis.questions > 0) {
        // Calculate progress based on completed questions
        const progressPercentage = analysis.completedQuestions
          ? Math.round((analysis.completedQuestions / analysis.questions) * 100)
          : 0
        
        setProgress(progressPercentage)
      } else {
        // Default progress
        setProgress(0)
      }
    } else {
      setSelectedProject(null)
      
      // Remove project ID from URL
      const url = new URL(window.location.href);
      url.searchParams.delete('projectId');
      window.history.pushState({}, '', url.toString());
      
      setProgress(0)
    }
  }

  const handleProjectChange = (project: Project) => {
    setSelectedProject(project)
    
    // Update URL with project ID (without reloading page)
    const url = new URL(window.location.href);
    url.searchParams.set('projectId', project.id);
    window.history.pushState({}, '', url.toString());
    
    // Find analysis for this specific project for progress tracking
    const projectAnalysis = analyses.find(analysis => analysis.projectId === project.id)
    
    if (projectAnalysis && projectAnalysis.questions > 0) {
      // Calculate progress based on completed questions
      const progressPercentage = projectAnalysis.completedQuestions
        ? Math.round((projectAnalysis.completedQuestions / projectAnalysis.questions) * 100)
        : 0
      
      setProgress(progressPercentage)
    } else {
      // Default progress
      setProgress(0)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Loading project workspace...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-lg w-full">
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-2">Error Loading Workspace</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">

      {/* New Header with Company/Project Selection and Progress Bar */}
      <ProjectHeader
        companies={companies}
        initialCompany={selectedCompany || undefined}
        initialProject={selectedProject || undefined}
        progress={progress}
        onCompanyChange={handleCompanyChange}
        onProjectChange={handleProjectChange}
      />

      {/* Tabs for navigation between writing, attachments, and preview */}
      <div className="border-b bg-white dark:bg-slate-900 px-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="w-full justify-start h-12">
            <TabsTrigger value="writing" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Application Sections
            </TabsTrigger>
            <TabsTrigger value="attachments" className="flex items-center">
              <Paperclip className="h-4 w-4 mr-2" />
              Project Attachments
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              Preview & Submit
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {activeTab === "writing" && selectedSection && (
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Application Sections */}
          <SectionsSidebar
            sections={sections}
            selectedSection={selectedSection}
            onSelectSectionAction={setSelectedSection}
          />

          {/* Main Content Area */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Agent Selector */}
            <AgentSelector
              agents={agents}
              selectedAgent={selectedAgent || agents[0]}
              onSelectAgent={setSelectedAgent}
              onCompare={() => setIsComparing(true)}
            />

            {/* Writing Canvas */}
            <div className="flex-1 overflow-hidden">
              <WritingCanvasWithLLM
                section={selectedSection}
                agent={selectedAgent || agents[0]}
                personalTouchMode={personalTouchMode}
                onTogglePersonalTouchAction={() => setPersonalTouchMode(!personalTouchMode)}
                isComparing={isComparing}
                onCloseCompareAction={() => setIsComparing(false)}
                onUpdateSection={handleSectionUpdate}
              />
            </div>
          </div>

          {/* Right Sidebar - Context Panel */}
          <ContextPanel
            activeTab={contextTab}
            onChangeTab={setContextTab}
            analysisData={analysisData}
            referenceDocuments={referenceDocuments}
            projectDetails={selectedProject || undefined}
          />
        </div>
      )}

      {activeTab === "attachments" && (
        <div className="flex-1 overflow-auto p-6">
          <ProjectAttachments />

          <div className="flex justify-between mt-6 max-w-full px-6">
            <Button variant="outline" onClick={() => setActiveTab("writing")}>
              Back to Writing
            </Button>
            <Button onClick={() => setActiveTab("preview")}>Continue to Preview</Button>
          </div>
        </div>
      )}

      {activeTab === "preview" && (
        <div className="flex-1 overflow-auto">
          <PreviewSubmit onBackAction={() => setActiveTab("writing")} />
        </div>
      )}
    </div>
  )
}
