"use client"

import { useState, useEffect } from "react"
import { Layers, Search, Plus, Filter, X, Edit, Trash2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import type { DocumentSection } from "@/lib/document-sections-data"

export default function DocumentSectionsPage() {
  const { toast } = useToast()
  const [sections, setSections] = useState<DocumentSection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [projectFilter, setProjectFilter] = useState<string | null>(null)
  const [showRequiredOnly, setShowRequiredOnly] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null)
  
  // New state for create section form
  const [newSectionOpen, setNewSectionOpen] = useState(false)
  const [newSection, setNewSection] = useState({
    title: "",
    description: "",
    category: "",
    wordCountMin: "",
    wordCountMax: "",
    associatedProjects: [] as string[],
    order: "",
    isRequired: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch document sections from API
  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true)
        console.log('Fetching document sections from API...')
        
        const response = await fetch('/api/document-sections', {
          cache: 'no-store',
          credentials: 'same-origin'
        })
        
        console.log('API response status:', response.status)
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('API error details:', errorData)
          
          throw new Error(`Failed to fetch document sections: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        console.log(`Received ${data.length} document sections from API`)
        setSections(data)
      } catch (err) {
        console.error('Error fetching document sections:', err)
        setError(err instanceof Error ? err.message : 'Failed to load document sections. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchSections()
  }, [])

  // Get unique categories and projects for filters
  const categories = Array.from(new Set(sections.map((section) => section.category)))
  const projects = Array.from(new Set(sections.flatMap((section) => section.associatedProjects))).sort()
  
  // Predefined category options (in case no sections are loaded yet)
  const categoryOptions = categories.length > 0 ? categories : ["Overview", "Technical", "Financial", "Impact", "Implementation"]

  // Filter sections based on search query and filters
  const filteredSections = sections.filter((section) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Category filter
    const matchesCategory = !categoryFilter || section.category === categoryFilter

    // Project filter
    const matchesProject = !projectFilter || section.associatedProjects.includes(projectFilter)

    // Required filter
    const matchesRequired = !showRequiredOnly || section.isRequired

    return matchesSearch && matchesCategory && matchesProject && matchesRequired
  })

  // Sort sections by order
  const sortedSections = [...filteredSections].sort((a, b) => a.order - b.order)

  // Handle delete confirmation
  const handleDeleteClick = (id: string) => {
    setSectionToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!sectionToDelete) return
    
    try {
      console.log(`Deleting section with ID: ${sectionToDelete}`)
      
      const response = await fetch(`/api/document-sections/${sectionToDelete}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error(`Failed to delete section: ${response.status} ${response.statusText}`)
      }
      
      // Update UI to remove the deleted section
      setSections(prev => prev.filter(section => section.id !== sectionToDelete))
      
      toast({
        title: "Section deleted",
        description: "Document section has been successfully deleted.",
        duration: 3000
      })
    } catch (error) {
      console.error('Error deleting section:', error)
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete section",
        variant: "destructive",
        duration: 5000
      })
    } finally {
      setDeleteDialogOpen(false)
      setSectionToDelete(null)
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setCategoryFilter(null)
    setProjectFilter(null)
    setShowRequiredOnly(false)
    setSearchQuery("")
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  // Get category badge color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Overview":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "Technical":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
      case "Financial":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
      case "Impact":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      case "Implementation":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300"
    }
  }

  // Handle checkbox change
  const handleRequiredCheckboxChange = (checked: boolean | "indeterminate") => {
    setShowRequiredOnly(checked === true)
  }

  // Handle create section form input changes
  const handleNewSectionChange = (field: string, value: any) => {
    setNewSection(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle create section form submission
  const handleCreateSection = async () => {
    try {
      // Basic validation
      if (!newSection.title || !newSection.category) {
        toast({
          title: "Missing fields",
          description: "Title and Category are required fields",
          variant: "destructive",
          duration: 3000
        })
        return
      }

      setIsSubmitting(true)
      
      // Prepare data for API
      const sectionData = {
        ...newSection,
        wordCountMin: newSection.wordCountMin ? parseInt(newSection.wordCountMin) : undefined,
        wordCountMax: newSection.wordCountMax ? parseInt(newSection.wordCountMax) : undefined,
        order: newSection.order ? parseInt(newSection.order) : undefined
      }
      
      // Send to API
      const response = await fetch('/api/document-sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sectionData)
      })
      
      if (!response.ok) {
        throw new Error(`Failed to create section: ${response.status} ${response.statusText}`)
      }
      
      const createdSection = await response.json()
      
      // Update UI with new section
      setSections(prev => [...prev, createdSection])
      
      // Reset form and close dialog
      setNewSection({
        title: "",
        description: "",
        category: "",
        wordCountMin: "",
        wordCountMax: "",
        associatedProjects: [],
        order: "",
        isRequired: false
      })
      setNewSectionOpen(false)
      
      toast({
        title: "Section created",
        description: "New document section has been successfully created.",
        duration: 3000
      })
    } catch (error) {
      console.error('Error creating section:', error)
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create section",
        variant: "destructive",
        duration: 5000
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state
  if (loading) {
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
            <button 
              className="underline font-medium"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      {/* Debug section - only visible during development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-100 p-4 rounded mb-4 overflow-auto max-h-80 m-4">
          <h3 className="font-bold mb-2">Debug Info:</h3>
          <p>Sections count: {sections.length}</p>
          <p>Filtered sections count: {filteredSections.length}</p>
          <details>
            <summary className="cursor-pointer font-medium text-blue-600">Raw Sections Data</summary>
            <pre className="text-xs mt-2">{JSON.stringify(sections, null, 2)}</pre>
          </details>
        </div>
      )}

      <div className="border-b bg-white dark:bg-slate-900 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold flex items-center">
                <Layers className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
                Document Sections
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage section templates for funding project applications
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sections..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Dialog open={newSectionOpen} onOpenChange={setNewSectionOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-1.5" />
                    New Section
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Create New Document Section</DialogTitle>
                    <DialogDescription>Add a new section template to your document library.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="title" className="text-sm font-medium">
                        Section Title
                      </label>
                      <Input 
                        id="title" 
                        placeholder="e.g. Executive Summary" 
                        value={newSection.title}
                        onChange={(e) => handleNewSectionChange('title', e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="description" className="text-sm font-medium">
                        Description
                      </label>
                      <Input 
                        id="description" 
                        placeholder="Brief description of this section's purpose" 
                        value={newSection.description}
                        onChange={(e) => handleNewSectionChange('description', e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="category" className="text-sm font-medium">
                        Category
                      </label>
                      <Select 
                        value={newSection.category} 
                        onValueChange={(value) => handleNewSectionChange('category', value)}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label htmlFor="minWords" className="text-sm font-medium">
                          Minimum Word Count
                        </label>
                        <Input 
                          id="minWords" 
                          type="number" 
                          placeholder="e.g. 200" 
                          value={newSection.wordCountMin}
                          onChange={(e) => handleNewSectionChange('wordCountMin', e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="maxWords" className="text-sm font-medium">
                          Maximum Word Count
                        </label>
                        <Input 
                          id="maxWords" 
                          type="number" 
                          placeholder="e.g. 500" 
                          value={newSection.wordCountMax}
                          onChange={(e) => handleNewSectionChange('wordCountMax', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="projects" className="text-sm font-medium">
                        Associated Projects
                      </label>
                      <Select 
                        value={newSection.associatedProjects[0] || "none"} 
                        onValueChange={(value) => handleNewSectionChange('associatedProjects', value !== "none" ? [value] : [])}
                      >
                        <SelectTrigger id="projects">
                          <SelectValue placeholder="Select associated projects" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Project</SelectItem>
                          {projects.length > 0 ? (
                            projects.map((project) => (
                              <SelectItem key={project} value={project}>
                                {project}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="add-later" disabled>
                              No projects available - can add later
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="order" className="text-sm font-medium">
                        Display Order
                      </label>
                      <Input 
                        id="order" 
                        type="number" 
                        placeholder="e.g. 1" 
                        value={newSection.order}
                        onChange={(e) => handleNewSectionChange('order', e.target.value)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="required" 
                        checked={newSection.isRequired}
                        onCheckedChange={(checked) => handleNewSectionChange('isRequired', checked === true)}
                      />
                      <label
                        htmlFor="required"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Required Section
                      </label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setNewSectionOpen(false)} disabled={isSubmitting}>Cancel</Button>
                    <Button onClick={handleCreateSection} disabled={isSubmitting}>
                      {isSubmitting ? 'Creating...' : 'Create Section'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 pb-16">
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
            <Select value={categoryFilter || "all"} onValueChange={(value) => setCategoryFilter(value === "all" ? null : value)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categoryOptions.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={projectFilter || "all"} onValueChange={(value) => setProjectFilter(value === "all" ? null : value)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project} value={project}>
                    {project}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="required-filter" 
                checked={showRequiredOnly} 
                onCheckedChange={handleRequiredCheckboxChange} 
              />
              <label
                htmlFor="required-filter"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Required Sections Only
              </label>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={clearFilters} className="flex-shrink-0 h-9">
            <X className="h-4 w-4 mr-1.5" />
            Clear Filters
          </Button>
        </div>

        <Card className="shadow-sm border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Section</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Word Count</TableHead>
                <TableHead>Required</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSections.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <FileText className="h-8 w-8 mb-2 opacity-30" />
                      <p>No document sections found</p>
                      <p className="text-sm">
                        {searchQuery || categoryFilter || projectFilter || showRequiredOnly
                          ? "Try adjusting your filters"
                          : "Add a section to get started"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sortedSections.map((section) => (
                  <TableRow key={section.id} className="group">
                    <TableCell>
                      <div className="font-medium">{section.title}</div>
                      <div className="text-sm text-muted-foreground">{section.description}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(section.category)} variant="outline">
                        {section.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {section.wordCountMin && section.wordCountMax
                        ? `${section.wordCountMin}-${section.wordCountMax}`
                        : section.wordCountMin
                        ? `Min: ${section.wordCountMin}`
                        : section.wordCountMax
                        ? `Max: ${section.wordCountMax}`
                        : "Not specified"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={section.isRequired ? "default" : "outline"}>
                        {section.isRequired ? "Required" : "Optional"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate">
                        {section.associatedProjects.length > 0
                          ? section.associatedProjects.join(", ")
                          : "None specified"}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(section.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                            <span className="sr-only">Open menu</span>
                            <Edit className="h-4 w-4 mr-1.5" />
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-1.5" />
                            Edit Section
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteClick(section.id)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-1.5" />
                            Delete Section
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document Section</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document section? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
