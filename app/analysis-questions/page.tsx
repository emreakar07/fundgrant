"use client"

import { useState } from "react"
import { FileQuestion, Search, Plus, Filter, X, Edit, Trash2, Tag } from "lucide-react"
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
import { analysisQuestionsData } from "@/lib/analysis-questions-data"

export default function AnalysisQuestionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [projectFilter, setProjectFilter] = useState<string | null>(null)
  const [showRequiredOnly, setShowRequiredOnly] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null)

  // Get unique categories and projects for filters
  const categories = Array.from(new Set(analysisQuestionsData.map((q) => q.category)))
  const projects = Array.from(new Set(analysisQuestionsData.flatMap((q) => q.relatedProjects))).sort()

  // Filter questions based on search query and filters
  const filteredQuestions = analysisQuestionsData.filter((question) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      question.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    // Category filter
    const matchesCategory = !categoryFilter || question.category === categoryFilter

    // Project filter
    const matchesProject = !projectFilter || question.relatedProjects.includes(projectFilter)

    // Required filter
    const matchesRequired = !showRequiredOnly || question.isRequired

    return matchesSearch && matchesCategory && matchesProject && matchesRequired
  })

  // Handle delete confirmation
  const handleDeleteClick = (id: string) => {
    setQuestionToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    // In a real app, this would call an API to delete the question
    console.log(`Deleting question with ID: ${questionToDelete}`)
    setDeleteDialogOpen(false)
    setQuestionToDelete(null)
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
      case "Technical":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "Market":
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

  return (
    <div className="flex flex-col min-h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <div className="border-b bg-white dark:bg-slate-900 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold flex items-center">
                <FileQuestion className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
                Analysis Questions
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage reusable analysis questions for funding applications
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-1.5" />
                    New Question
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Create New Analysis Question</DialogTitle>
                    <DialogDescription>Add a new question to your analysis question library.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="question" className="text-sm font-medium">
                        Question Text
                      </label>
                      <Input id="question" placeholder="Enter your question..." />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="category" className="text-sm font-medium">
                        Category
                      </label>
                      <Select>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="tags" className="text-sm font-medium">
                        Tags (comma separated)
                      </label>
                      <Input id="tags" placeholder="e.g. Market, Strategy, Competition" />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="projects" className="text-sm font-medium">
                        Related Projects
                      </label>
                      <Select>
                        <SelectTrigger id="projects">
                          <SelectValue placeholder="Select related projects" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem key={project} value={project}>
                              {project}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="required" />
                      <label
                        htmlFor="required"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Required Question
                      </label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Create Question</Button>
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
            <Select value={categoryFilter || ""} onValueChange={(value) => setCategoryFilter(value || null)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={projectFilter || ""} onValueChange={(value) => setProjectFilter(value || null)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Related Project" />
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
                onCheckedChange={(checked) => setShowRequiredOnly(checked === true)}
              />
              <label
                htmlFor="required-filter"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Show Required Questions Only
              </label>
            </div>
          </div>

          {(categoryFilter !== null || projectFilter !== null || showRequiredOnly || searchQuery !== "") && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9">
              <X className="h-4 w-4 mr-1.5" />
              Clear Filters
            </Button>
          )}
        </div>

        <Card className="border shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Question</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Related Projects</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuestions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No questions found. Try adjusting your filters or create a new question.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuestions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            {question.text}
                            <div className="text-xs text-muted-foreground mt-1">
                              Updated: {formatDate(question.updatedAt)}
                            </div>
                          </div>
                          {question.isRequired && (
                            <Badge
                              variant="outline"
                              className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                            >
                              Required
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getCategoryColor(question.category)}>
                          {question.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {question.relatedProjects.length > 2 ? (
                            <>
                              <Badge variant="secondary" className="whitespace-nowrap">
                                {question.relatedProjects[0]}
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Badge variant="outline" className="cursor-pointer">
                                    +{question.relatedProjects.length - 1} more
                                  </Badge>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                  {question.relatedProjects.slice(1).map((project) => (
                                    <DropdownMenuItem key={project}>{project}</DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </>
                          ) : (
                            question.relatedProjects.map((project) => (
                              <Badge key={project} variant="secondary" className="whitespace-nowrap">
                                {project}
                              </Badge>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {question.tags.length > 2 ? (
                            <>
                              <div className="flex items-center">
                                <Tag className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span className="text-xs">{question.tags[0]}</span>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Badge variant="outline" className="cursor-pointer">
                                    +{question.tags.length - 1} more
                                  </Badge>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                  {question.tags.slice(1).map((tag) => (
                                    <DropdownMenuItem key={tag}>{tag}</DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </>
                          ) : (
                            question.tags.map((tag) => (
                              <div key={tag} className="flex items-center">
                                <Tag className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span className="text-xs">{tag}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 dark:text-red-400"
                            onClick={() => handleDeleteClick(question.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this question? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
