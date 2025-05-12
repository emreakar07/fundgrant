"use client"

import { useState, useEffect } from "react"
import { Sparkles, Search, Filter, Calendar, ArrowRight, CheckCircle2, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { companiesData, matchesData } from "@/lib/fundai-matching-data"

export default function FundAIMatchingPage() {
  const [selectedCompany, setSelectedCompany] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [minMatchScore, setMinMatchScore] = useState<number>(0)
  const [sectorFilter, setSectorFilter] = useState<string | null>(null)
  const [matches, setMatches] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Get unique sectors for filter
  const sectors = matches.length > 0 ? Array.from(new Set(matches.map((match) => match.sector))) : []

  // Handle company selection
  useEffect(() => {
    if (selectedCompany) {
      setIsLoading(true)
      // Simulate API call delay
      setTimeout(() => {
        setMatches(matchesData[selectedCompany] || [])
        setIsLoading(false)
      }, 800)
    } else {
      setMatches([])
    }
    // Reset filters when company changes
    setSearchQuery("")
    setMinMatchScore(0)
    setSectorFilter(null)
  }, [selectedCompany])

  // Filter matches based on search query and filters
  const filteredMatches = matches.filter((match) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      match.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Match score filter
    const matchesScore = match.matchScore >= minMatchScore

    // Sector filter
    const matchesSector = !sectorFilter || match.sector === sectorFilter

    return matchesSearch && matchesScore && matchesSector
  })

  // Sort matches by match score (descending)
  const sortedMatches = [...filteredMatches].sort((a, b) => b.matchScore - a.matchScore)

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setMinMatchScore(0)
    setSectorFilter(null)
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

  // Calculate days remaining until deadline
  const getDaysRemaining = (deadline: string) => {
    const deadlineDate = new Date(deadline)
    const today = new Date()
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Get match score color
  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400"
    if (score >= 75) return "text-blue-600 dark:text-blue-400"
    if (score >= 60) return "text-amber-600 dark:text-amber-400"
    return "text-red-600 dark:text-red-400"
  }

  // Get match strength color
  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "strong":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "medium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "weak":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300"
    }
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "sector":
        return (
          <Badge variant="outline" className="mr-2">
            Sector
          </Badge>
        )
      case "size":
        return (
          <Badge variant="outline" className="mr-2">
            Size
          </Badge>
        )
      case "location":
        return (
          <Badge variant="outline" className="mr-2">
            Location
          </Badge>
        )
      case "innovation":
        return (
          <Badge variant="outline" className="mr-2">
            Innovation
          </Badge>
        )
      case "sustainability":
        return (
          <Badge variant="outline" className="mr-2">
            Sustainability
          </Badge>
        )
      case "financial":
        return (
          <Badge variant="outline" className="mr-2">
            Financial
          </Badge>
        )
      case "expertise":
        return (
          <Badge variant="outline" className="mr-2">
            Expertise
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="mr-2">
            {category}
          </Badge>
        )
    }
  }

  return (
    <div className="flex flex-col min-h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <div className="border-b bg-white dark:bg-slate-900 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold flex items-center">
                <Sparkles className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
                FundAI Matching
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                AI-powered matching of companies to optimal funding opportunities
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 pb-16">
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="company-select" className="block text-sm font-medium mb-2">
                Select a Company
              </label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger id="company-select" className="w-full">
                  <SelectValue placeholder="Choose a company to find matching funds" />
                </SelectTrigger>
                <SelectContent>
                  {companiesData.map((company) => (
                    <SelectItem key={company.id} value={company.id ? company.id : "default-company"}>
                      {company.name} - {company.sector} ({company.size})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCompany && (
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-100 dark:border-blue-900">
                <h3 className="font-medium mb-1">{companiesData.find((c) => c.id === selectedCompany)?.name}</h3>
                <div className="text-sm text-muted-foreground mb-2">
                  {companiesData.find((c) => c.id === selectedCompany)?.sector} •{" "}
                  {companiesData.find((c) => c.id === selectedCompany)?.size} Company
                </div>
                <p className="text-sm">{companiesData.find((c) => c.id === selectedCompany)?.description}</p>
              </div>
            )}
          </div>
        </div>

        {selectedCompany && (
          <>
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="match-score" className="text-xs text-muted-foreground mb-1">
                    Minimum Match Score: {minMatchScore}%
                  </label>
                  <input
                    id="match-score"
                    type="range"
                    min="0"
                    max="100"
                    value={minMatchScore}
                    onChange={(e) => setMinMatchScore(Number.parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <Select value={sectorFilter || ""} onValueChange={(value) => setSectorFilter(value || null)}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Filter by sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Sectors</SelectItem>
                    {sectors.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(searchQuery !== "" || minMatchScore > 0 || sectorFilter !== null) && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-10">
                  <X className="h-4 w-4 mr-1.5" />
                  Clear Filters
                </Button>
              )}
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-muted-foreground">
                  Analyzing company profile and finding optimal funding matches...
                </p>
              </div>
            ) : sortedMatches.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No matching funding projects found</h3>
                <p className="text-muted-foreground mt-2">
                  Try adjusting your filters or selecting a different company
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-medium">
                    {sortedMatches.length} Matching Funding {sortedMatches.length === 1 ? "Project" : "Projects"}
                  </h2>
                  <div className="text-sm text-muted-foreground">Sorted by match score</div>
                </div>

                {sortedMatches.map((match) => (
                  <Card key={match.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold">{match.projectTitle}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge>{match.sector}</Badge>
                                <div className="text-sm text-muted-foreground">
                                  €{match.fundingAmount.toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className={`text-2xl font-bold ${getMatchScoreColor(match.matchScore)}`}>
                                    {match.matchScore}%
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Match Score</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>

                          <p className="text-sm mb-4">{match.description}</p>

                          <div className="mb-4">
                            <h4 className="text-sm font-medium mb-2">Match Reasons:</h4>
                            <div className="space-y-2">
                              {match.matchReasons.map((reason: any, index: number) => (
                                <div key={index} className="flex items-center">
                                  {getCategoryIcon(reason.category)}
                                  <span className="text-sm">{reason.description}</span>
                                  <Badge variant="outline" className={`ml-auto ${getStrengthColor(reason.strength)}`}>
                                    {reason.strength}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-1.5 text-muted-foreground" />
                            <span>
                              Deadline: {formatDate(match.deadline)}({getDaysRemaining(match.deadline)} days remaining)
                            </span>
                          </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 flex flex-col justify-between md:w-64">
                          <div>
                            <div className="mb-4">
                              <div className="text-sm font-medium mb-1">Match Score</div>
                              <div className="flex items-center gap-2">
                                <Progress value={match.matchScore} className="h-2" />
                                <span className={`font-bold ${getMatchScoreColor(match.matchScore)}`}>
                                  {match.matchScore}%
                                </span>
                              </div>
                            </div>

                            <div className="space-y-1 mb-6">
                              <div className="flex items-center gap-1 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <span>Eligibility confirmed</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <span>AI-verified match</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 mt-4">
                            <Button variant="default">Start Writing</Button>
                            <Button variant="outline">
                              View Details <ArrowRight className="ml-1.5 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {!selectedCompany && !isLoading && (
          <div className="text-center py-16">
            <Sparkles className="h-16 w-16 text-blue-600/50 dark:text-blue-400/50 mx-auto mb-4" />
            <h2 className="text-xl font-medium mb-2">Select a company to start matching</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              FundAI will analyze the company profile and find the most suitable funding opportunities based on sector,
              size, and other relevant factors.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
