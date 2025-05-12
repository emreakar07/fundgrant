"use client"

import { useState, useEffect } from "react"
import { FileText, Search, Filter, Plus, Tag, Calendar, Trash2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ReferenceDocument } from "@/lib/documents-data"
import { documentCategories } from "@/lib/documents-data"
import Link from "next/link"

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<ReferenceDocument[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<ReferenceDocument[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortOption, setSortOption] = useState("uploadDate-desc")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch documents from API
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true)
        console.log('Fetching documents from API...')
        
        const response = await fetch('/api/documents', {
          cache: 'no-store',
          credentials: 'same-origin'
        })
        
        console.log('API response status:', response.status)
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('API error details:', errorData)
          
          throw new Error(`Failed to fetch documents: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        console.log(`Received ${data.length} documents from API`)
        setDocuments(data)
        setFilteredDocuments(data)
      } catch (err) {
        console.error('Error fetching documents:', err)
        setError(err instanceof Error ? err.message : 'Failed to load documents. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  // Filter and sort documents
  useEffect(() => {
    // Start with all documents
    let results = [...documents]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter(doc => {
        return (
          doc.title.toLowerCase().includes(query) ||
          (doc.description && doc.description.toLowerCase().includes(query)) ||
          (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(query)))
        )
      })
    }

    // Apply category filter
    if (categoryFilter && categoryFilter !== "all") {
      results = results.filter(doc => doc.category === categoryFilter)
    }

    // Apply sorting
    const [sortField, sortDirection] = sortOption.split('-')
    results.sort((a, b) => {
      let comparison = 0
      
      // Handle date fields
      if (sortField === 'uploadDate' || sortField === 'lastModified') {
        const dateA = new Date(a[sortField as keyof ReferenceDocument] as string || '').getTime()
        const dateB = new Date(b[sortField as keyof ReferenceDocument] as string || '').getTime()
        comparison = dateA - dateB
      } 
      // Handle string fields
      else if (sortField === 'title' || sortField === 'category') {
        const valueA = String(a[sortField as keyof ReferenceDocument] || '')
        const valueB = String(b[sortField as keyof ReferenceDocument] || '')
        comparison = valueA.localeCompare(valueB)
      }
      
      return sortDirection === 'asc' ? comparison : -comparison
    })

    setFilteredDocuments(results)
  }, [documents, searchQuery, categoryFilter, sortOption])

  const handleDeleteDocument = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return
    }

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete document')
      }

      // Remove the document from state
      setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== id))
    } catch (error) {
      console.error('Error deleting document:', error)
      alert('Failed to delete document. Please try again.')
    }
  }

  const formatFileSize = (sizeInBytes?: number) => {
    if (!sizeInBytes) return "Unknown size"
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (sizeInBytes === 0) return '0 Byte'
    const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024))
    return `${Math.round(sizeInBytes / Math.pow(1024, i))} ${sizes[i]}`
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Get document icon based on file type
  const getDocumentIcon = (fileType?: string) => {
    if (!fileType) return <FileText className="h-5 w-5 text-gray-400" />
    
    if (fileType.includes('pdf')) {
      return <FileText className="h-5 w-5 text-red-500" />
    } else if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
      return <FileText className="h-5 w-5 text-green-500" />
    } else if (fileType.includes('presentation') || fileType.includes('powerpoint')) {
      return <FileText className="h-5 w-5 text-orange-500" />
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <FileText className="h-5 w-5 text-blue-500" />
    } else {
      return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

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
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <FileText className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
            Reference Documents
          </h1>
          <p className="text-muted-foreground">
            Manage and browse reference materials and templates
          </p>
        </div>
        <Button asChild>
          <Link href="/documents/upload">
            <Plus className="h-4 w-4 mr-2" />
            Upload Document
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Documents</CardTitle>
          <CardDescription>All reference materials and templates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search documents..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {documentCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uploadDate-desc">Newest First</SelectItem>
                  <SelectItem value="uploadDate-asc">Oldest First</SelectItem>
                  <SelectItem value="title-asc">Title A-Z</SelectItem>
                  <SelectItem value="title-desc">Title Z-A</SelectItem>
                  <SelectItem value="category-asc">Category A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getDocumentIcon(doc.fileType)}
                          <Link 
                            href={`/documents/${doc.id}`}
                            className="hover:text-blue-600 hover:underline focus:underline focus:text-blue-600"
                          >
                            {doc.title}
                          </Link>
                        </div>
                        {doc.description && (
                          <p className="text-muted-foreground text-xs mt-1 truncate max-w-md">
                            {doc.description}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        {doc.category ? (
                          <Badge variant="outline">{doc.category}</Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">Uncategorized</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {doc.tags && doc.tags.length > 0 ? (
                            doc.tags.map((tag, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">No tags</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm">{formatDate(doc.uploadDate)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{formatFileSize(doc.fileSize)}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/documents/${doc.id}`}>
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            {doc.fileUrl && (
                              <DropdownMenuItem asChild>
                                <a 
                                  href={doc.fileUrl} 
                                  download
                                  className="flex items-center"
                                >
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </a>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteDocument(doc.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      {searchQuery || categoryFilter !== "all" 
                        ? "No documents found matching your filters."
                        : "No documents available. Upload your first document."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
