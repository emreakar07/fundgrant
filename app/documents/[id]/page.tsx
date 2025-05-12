"use client"

import { useState, useEffect } from "react"
import { FileText, Download, ArrowLeft, Edit, Trash2, Save, X, Calendar, Tag, FileType } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { ReferenceDocument } from "@/lib/documents-data"
import { documentCategories } from "@/lib/documents-data"

export default function DocumentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [document, setDocument] = useState<ReferenceDocument | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<ReferenceDocument> | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [newTag, setNewTag] = useState("")

  // Fetch document data
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true)
        console.log(`Fetching document with ID: ${params.id}...`)
        
        const response = await fetch(`/api/documents/${params.id}`, {
          cache: 'no-store',
          credentials: 'same-origin'
        })
        
        console.log('API response status:', response.status)
        
        if (response.status === 404) {
          setDocument(null)
          setError("Document not found")
          return
        }
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('API error details:', errorData)
          
          throw new Error(`Failed to fetch document: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        console.log('Received document data from API:', data)
        setDocument(data)
        setFormData(data)
      } catch (err) {
        console.error('Error fetching document:', err)
        setError(err instanceof Error ? err.message : 'Failed to load document details. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchDocument()
    }
  }, [params.id])

  const handleInputChange = (field: keyof ReferenceDocument, value: any) => {
    if (!formData) return
    
    setFormData((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        [field]: value
      }
    })
  }

  const handleAddTag = () => {
    if (!newTag.trim() || !formData) return
    
    const trimmedTag = newTag.trim()
    const currentTags = formData.tags || []
    
    // Don't add duplicate tags
    if (currentTags.includes(trimmedTag)) {
      setNewTag("")
      return
    }
    
    setFormData({
      ...formData,
      tags: [...currentTags, trimmedTag]
    })
    
    setNewTag("")
  }

  const handleRemoveTag = (tagToRemove: string) => {
    if (!formData || !formData.tags) return
    
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const handleSave = async () => {
    if (!formData) return
    
    try {
      setSaving(true)
      
      // Handle special category value
      if (formData.category === 'uncategorized') {
        formData.category = undefined
      }
      
      // Update the document via API
      const response = await fetch(`/api/documents/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update document')
      }
      
      const updatedDocument = await response.json()
      setDocument(updatedDocument)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating document:', error)
      alert('Failed to save changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(document)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return
    }

    try {
      setLoading(true)
      
      const response = await fetch(`/api/documents/${params.id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete document')
      }
      
      router.push('/documents')
    } catch (error) {
      console.error('Error deleting document:', error)
      alert('Failed to delete document. Please try again.')
      setLoading(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatFileSize = (sizeInBytes?: number) => {
    if (!sizeInBytes) return "Unknown size"
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (sizeInBytes === 0) return '0 Byte'
    const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024))
    return `${Math.round(sizeInBytes / Math.pow(1024, i))} ${sizes[i]}`
  }

  // Get document icon based on file type
  const getDocumentIcon = (fileType?: string) => {
    if (!fileType) return <FileText className="h-6 w-6 text-gray-400" />
    
    if (fileType.includes('pdf')) {
      return <FileText className="h-6 w-6 text-red-500" />
    } else if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
      return <FileText className="h-6 w-6 text-green-500" />
    } else if (fileType.includes('presentation') || fileType.includes('powerpoint')) {
      return <FileText className="h-6 w-6 text-orange-500" />
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <FileText className="h-6 w-6 text-blue-500" />
    } else {
      return <FileText className="h-6 w-6 text-gray-500" />
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
            <Button 
              variant="outline"
              className="mt-2"
              onClick={() => router.push('/documents')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Documents
            </Button>
          </p>
        </div>
      </div>
    )
  }

  if (!document) {
    return (
      <div className="p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Not Found: </strong>
          <span className="block sm:inline">The requested document could not be found.</span>
          <p className="mt-2 text-sm">
            <Button 
              variant="outline"
              className="mt-2"
              onClick={() => router.push('/documents')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Documents
            </Button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => router.push('/documents')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Documents
        </Button>
        
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <div className="flex items-center">
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-b-0 border-white rounded-full"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              {document.fileUrl && (
                <Button variant="outline" asChild>
                  <a href={document.fileUrl} download>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </a>
                </Button>
              )}
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {getDocumentIcon(document.fileType)}
                {isEditing ? (
                  <Input
                    value={formData?.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="text-xl font-semibold"
                  />
                ) : (
                  <CardTitle className="text-xl">{document.title}</CardTitle>
                )}
              </div>
              {!isEditing && document.status && (
                <Badge variant={document.status === 'active' ? 'default' : document.status === 'archived' ? 'secondary' : 'outline'}>
                  {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Description</h3>
              {isEditing ? (
                <Textarea
                  value={formData?.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="min-h-[100px]"
                  placeholder="Enter a description of this document..."
                />
              ) : (
                <p className="text-muted-foreground">{document.description || 'No description provided.'}</p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Category</h3>
              {isEditing ? (
                <Select 
                  value={formData?.category || 'uncategorized'} 
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger className="w-full md:w-[300px]">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uncategorized">Uncategorized</SelectItem>
                    {documentCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant="outline">
                  {document.category || 'Uncategorized'}
                </Badge>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  Tags
                </div>
              </h3>
              
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData?.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      className="w-full md:w-[300px]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddTag()
                        }
                      }}
                    />
                    <Button type="button" size="sm" onClick={handleAddTag}>Add</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {document.tags && document.tags.length > 0 ? (
                    document.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground">No tags</span>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar with metadata */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Document Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {isEditing && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Status</h3>
                  <Select 
                    value={formData?.status || 'active'} 
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium mb-1">Upload Date</h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(document.uploadDate)}</span>
                </div>
              </div>
              
              {document.lastModified && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Last Modified</h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(document.lastModified)}</span>
                  </div>
                </div>
              )}
              
              {document.uploadedBy && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Uploaded By</h3>
                  <span className="text-muted-foreground">{document.uploadedBy}</span>
                </div>
              )}
              
              {document.fileType && (
                <div>
                  <h3 className="text-sm font-medium mb-1">File Type</h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileType className="h-4 w-4" />
                    <span>{document.fileType.split('/').pop()?.toUpperCase() || document.fileType}</span>
                  </div>
                </div>
              )}
              
              {document.fileSize && (
                <div>
                  <h3 className="text-sm font-medium mb-1">File Size</h3>
                  <span className="text-muted-foreground">{formatFileSize(document.fileSize)}</span>
                </div>
              )}
              
              {document.version && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Version</h3>
                  <span className="text-muted-foreground">{document.version}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 