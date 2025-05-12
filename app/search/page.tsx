"use client"

import { useState } from "react"
import { Search, FileText, Building2, FileQuestion, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [dateFilter, setDateFilter] = useState<string | null>(null)

  // Mock search results
  const mockResults = {
    projects: [
      { id: "1", title: "EU Green Innovation Fund", type: "Funding Project", date: "2025-06-15" },
      { id: "2", title: "Horizon Europe Research Grant", type: "Funding Project", date: "2025-04-22" },
      { id: "3", title: "Digital Europe Programme", type: "Funding Project", date: "2025-05-10" },
    ],
    companies: [
      { id: "1", name: "EcoTech Solutions", sector: "Clean Energy", type: "Company" },
      { id: "2", name: "MediNova Research", sector: "Healthcare", type: "Company" },
      { id: "3", name: "DigitalMind AI", sector: "Technology", type: "Company" },
    ],
    analyses: [
      { id: "1", title: "EcoTech Solutions - EU Green Innovation Fund", type: "Analysis", date: "2025-01-15" },
      { id: "2", title: "MediNova Research - Horizon Europe Research Grant", type: "Analysis", date: "2025-02-03" },
      { id: "3", title: "DigitalMind AI - Digital Europe Programme", type: "Analysis", date: "2025-01-28" },
    ],
    documents: [{ id: "1", title: 'Technical Specifications -  date: "2025-01-28' }],
    documents: [
      { id: "1", title: "Technical Specifications - EcoStore v2", type: "Document", date: "2025-01-10" },
      { id: "2", title: "Market Research Report - EU Energy Storage 2024", type: "Document", date: "2024-12-15" },
      { id: "3", title: "Environmental Impact Assessment - EcoStore", type: "Document", date: "2025-02-05" },
    ],
  }

  // Filter results based on search query, tab, and filters
  const filterResults = (items: any[], query: string) => {
    if (!items) return []

    return items.filter((item) => {
      // Search query filter
      const matchesQuery =
        query === "" ||
        (item.title && item.title.toLowerCase().includes(query.toLowerCase())) ||
        (item.name && item.name.toLowerCase().includes(query.toLowerCase()))

      // Type filter
      const matchesType = !typeFilter || item.type === typeFilter

      // Date filter (simplified for demo)
      const matchesDate = !dateFilter || (item.date && new Date(item.date) > new Date("2025-01-01"))

      return matchesQuery && matchesType && matchesDate
    })
  }

  // Get filtered results based on active tab
  const getFilteredResults = () => {
    if (activeTab === "all") {
      return {
        projects: filterResults(mockResults.projects, searchQuery),
        companies: filterResults(mockResults.companies, searchQuery),
        analyses: filterResults(mockResults.analyses, searchQuery),
        documents: filterResults(mockResults.documents, searchQuery),
      }
    } else {
      return {
        [activeTab]: filterResults(mockResults[activeTab as keyof typeof mockResults], searchQuery),
      }
    }
  }

  const filteredResults = getFilteredResults()
  const hasActiveFilters = typeFilter !== null || dateFilter !== null

  // Clear all filters
  const clearFilters = () => {
    setTypeFilter(null)
    setDateFilter(null)
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

  return (
    <div className="flex flex-col min-h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <div className="border-b bg-white dark:bg-slate-900 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold flex items-center">
                <Search className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
                Search
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Search across all content</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 pb-16">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for projects, companies, analyses, or documents..."
              className="pl-10 h-12 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="h-12">Search</Button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
            <Select value={typeFilter || ""} onValueChange={(value) => setTypeFilter(value || null)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Content Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Funding Project">Funding Projects</SelectItem>
                <SelectItem value="Company">Companies</SelectItem>
                <SelectItem value="Analysis">Analyses</SelectItem>
                <SelectItem value="Document">Documents</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter || ""} onValueChange={(value) => setDateFilter(value || null)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="recent">Last 30 days</SelectItem>
                <SelectItem value="quarter">Last 90 days</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9">
              <X className="h-4 w-4 mr-1.5" />
              Clear Filters
            </Button>
          )}
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Results</TabsTrigger>
            <TabsTrigger value="projects">Funding Projects</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="analyses">Analyses</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {Object.keys(filteredResults).map((category) => {
              const results = filteredResults[category as keyof typeof filteredResults]
              if (!results || results.length === 0) return null

              return (
                <div key={category} className="space-y-4">
                  <h2 className="text-lg font-medium flex items-center">
                    {category === "projects" && <FileText className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />}
                    {category === "companies" && (
                      <Building2 className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                    )}
                    {category === "analyses" && (
                      <FileQuestion className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                    )}
                    {category === "documents" && <FileText className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />}
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.slice(0, 3).map((result: any) => (
                      <SearchResultCard key={result.id} result={result} />
                    ))}
                  </div>
                  {results.length > 3 && (
                    <div className="text-center">
                      <Button variant="outline">View All {results.length} Results</Button>
                    </div>
                  )}
                </div>
              )
            })}
          </TabsContent>

          {["projects", "companies", "analyses", "documents"].map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResults[category as keyof typeof filteredResults]?.map((result: any) => (
                  <SearchResultCard key={result.id} result={result} />
                ))}
              </div>
              {filteredResults[category as keyof typeof filteredResults]?.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-muted-foreground">No results found</h3>
                  <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

function SearchResultCard({ result }: { result: any }) {
  // Format date if it exists
  const formattedDate = result.date
    ? new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(
        new Date(result.date),
      )
    : null

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium">{result.title || result.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{result.type}</Badge>
              {result.sector && <Badge variant="secondary">{result.sector}</Badge>}
            </div>
            {formattedDate && <p className="text-xs text-muted-foreground mt-2">{formattedDate}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
