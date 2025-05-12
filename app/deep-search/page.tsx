"use client"

import { useState } from "react"
import { SearchCode, Filter, FileText, Clock, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AppLayout } from "@/components/app-layout"

export default function DeepSearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)

    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false)
      setHasSearched(true)
    }, 1500)
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <SearchCode className="h-8 w-8 mr-2 text-blue-600" />
              DeepSearch
            </h1>
            <p className="text-muted-foreground">
              AI-powered search across all your documents, applications, and funding sources
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <SearchCode className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search across all documents, applications, and funding sources..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                  <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
                    {isSearching ? "Searching..." : "Search"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {hasSearched && (
              <Tabs defaultValue="all">
                <div className="flex items-center justify-between mb-4">
                  <TabsList>
                    <TabsTrigger value="all">All Results</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="applications">Applications</TabsTrigger>
                    <TabsTrigger value="funding">Funding Sources</TabsTrigger>
                  </TabsList>

                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>

                <TabsContent value="all" className="mt-0">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Search Results</CardTitle>
                      <CardDescription>Found 24 results for "{searchQuery}"</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ScrollArea className="h-[600px]">
                        <div className="divide-y">
                          {/* Document Result */}
                          <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-2 text-blue-600" />
                                <span className="font-medium">Technical Specifications - EcoStore v2</span>
                              </div>
                              <Badge variant="outline">Document</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">Last updated 3 days ago</p>
                            <p className="text-sm">
                              ...our revolutionary{" "}
                              <mark className="bg-yellow-100 dark:bg-yellow-900/50 px-1 rounded">energy storage</mark>{" "}
                              solution uses advanced materials to create a cost-effective, scalable system with minimal
                              environmental impact...
                            </p>
                            <div className="flex justify-end mt-2">
                              <Button variant="ghost" size="sm">
                                View Document
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            </div>
                          </div>

                          {/* Application Result */}
                          <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-2 text-green-600" />
                                <span className="font-medium">EU Green Innovation Fund - Executive Summary</span>
                              </div>
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              >
                                Application
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              EcoTech Solutions • Deadline: Jun 15, 2025
                            </p>
                            <p className="text-sm">
                              ...applying for the EU Green Innovation Fund to develop and scale our revolutionary{" "}
                              <mark className="bg-yellow-100 dark:bg-yellow-900/50 px-1 rounded">energy storage</mark>{" "}
                              solution. We believe this technology will significantly reduce carbon emissions...
                            </p>
                            <div className="flex justify-end mt-2">
                              <Button variant="ghost" size="sm">
                                View Application
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            </div>
                          </div>

                          {/* Funding Source Result */}
                          <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-2 text-purple-600" />
                                <span className="font-medium">Horizon Europe - Clean Energy Transition</span>
                              </div>
                              <Badge
                                variant="outline"
                                className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                              >
                                Funding Source
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">€5M-€10M • Deadline: Sep 30, 2025</p>
                            <p className="text-sm">
                              ...seeking innovative solutions for{" "}
                              <mark className="bg-yellow-100 dark:bg-yellow-900/50 px-1 rounded">energy storage</mark>{" "}
                              and grid integration to accelerate the clean energy transition across Europe...
                            </p>
                            <div className="flex justify-end mt-2">
                              <Button variant="ghost" size="sm">
                                View Funding Source
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </ScrollArea>
                    </CardContent>
                    <CardFooter className="border-t bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex items-center justify-between w-full">
                        <p className="text-sm text-muted-foreground">Showing 3 of 24 results</p>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            Previous
                          </Button>
                          <Button variant="outline" size="sm">
                            Next
                          </Button>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>

          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Recent Searches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-2 text-muted-foreground" />
                      <span className="text-sm">renewable energy funding</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <SearchCode className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-2 text-muted-foreground" />
                      <span className="text-sm">EU Green Deal requirements</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <SearchCode className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-2 text-muted-foreground" />
                      <span className="text-sm">carbon reduction metrics</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <SearchCode className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-blue-600" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Trending Topics</h4>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary">Energy Storage</Badge>
                      <Badge variant="secondary">Carbon Reduction</Badge>
                      <Badge variant="secondary">Circular Economy</Badge>
                      <Badge variant="secondary">Green Hydrogen</Badge>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Popular Funding Sources</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">EU Green Innovation Fund</span>
                        <Badge variant="outline">€750K</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Horizon Europe</span>
                        <Badge variant="outline">€5M-€10M</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Success Rate by Sector</h4>
                    <div className="h-24 flex items-end justify-between gap-1 mt-2">
                      <div className="flex flex-col items-center">
                        <div className="bg-blue-500 w-6 h-16 rounded-t"></div>
                        <span className="text-xs mt-1">Energy</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-blue-500 w-6 h-12 rounded-t"></div>
                        <span className="text-xs mt-1">Agri</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-blue-500 w-6 h-20 rounded-t"></div>
                        <span className="text-xs mt-1">Tech</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-blue-500 w-6 h-8 rounded-t"></div>
                        <span className="text-xs mt-1">Health</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-blue-500 w-6 h-14 rounded-t"></div>
                        <span className="text-xs mt-1">Trans</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
